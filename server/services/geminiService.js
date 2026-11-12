const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getSystemPrompt } = require("../prompts/systemPrompt");
const { handleClinicalFallback } = require("./clinicalFallback");
const {
  findDoctorBySpecialtyTool,
  checkAvailabilityTool,
  bookAppointmentTool,
  cancelAppointmentTool,
} = require("../tools/schedulingTools");

// Function declarations for Gemini
const toolDeclarations = [
  {
    name: "findDoctorBySpecialtyTool",
    description:
      "Find doctors available for a given medical specialty. Use this when the patient needs a doctor of a specific type.",
    parameters: {
      type: "object",
      properties: {
        specialty: {
          type: "string",
          description:
            "The medical specialty to search for (e.g. orthopedic, gynecologist, general physician, dentist, dermatologist, cardiologist, therapist, pediatrician).",
        },
      },
      required: ["specialty"],
    },
  },
  {
    name: "checkAvailabilityTool",
    description:
      "Check available appointment slots for a specific doctor on a specific date.",
    parameters: {
      type: "object",
      properties: {
        providerId: {
          type: "string",
          description: "The unique provider ID of the doctor.",
        },
        date: {
          type: "string",
          description: "The date to check in YYYY-MM-DD format.",
        },
      },
      required: ["providerId", "date"],
    },
  },
  {
    name: "bookAppointmentTool",
    description:
      "Book an appointment with a doctor. Requires all patient details and appointment time.",
    parameters: {
      type: "object",
      properties: {
        providerId: {
          type: "string",
          description: "The unique provider ID of the doctor.",
        },
        patientName: {
          type: "string",
          description: "Full name of the patient.",
        },
        patientPhone: {
          type: "string",
          description: "Phone number of the patient.",
        },
        startTime: {
          type: "string",
          description:
            "Appointment start time in ISO 8601 format (e.g. 2026-11-12T09:00:00+05:00).",
        },
        reason: {
          type: "string",
          description: "Reason for the appointment.",
        },
      },
      required: ["providerId", "patientName", "patientPhone", "startTime", "reason"],
    },
  },
  {
    name: "cancelAppointmentTool",
    description:
      "Cancel an existing appointment. Requires the provider ID, start time, and patient phone to identify the booking.",
    parameters: {
      type: "object",
      properties: {
        providerId: {
          type: "string",
          description: "The unique provider ID of the doctor.",
        },
        startTime: {
          type: "string",
          description:
            "The start time of the appointment to cancel in ISO 8601 format.",
        },
        patientPhone: {
          type: "string",
          description: "Phone number of the patient who booked.",
        },
      },
      required: ["providerId", "startTime", "patientPhone"],
    },
  },
];

// Map of tool name → implementation
const toolImplementations = {
  findDoctorBySpecialtyTool: (args) => findDoctorBySpecialtyTool(args.specialty),
  checkAvailabilityTool: (args) => checkAvailabilityTool(args.providerId, args.date),
  bookAppointmentTool: (args) =>
    bookAppointmentTool(
      args.providerId,
      args.patientName,
      args.patientPhone,
      args.startTime,
      args.reason
    ),
  cancelAppointmentTool: (args) =>
    cancelAppointmentTool(args.providerId, args.startTime, args.patientPhone),
};

// Store chat sessions in memory
const sessions = new Map();

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: getSystemPrompt(),
    tools: [{ functionDeclarations: toolDeclarations }],
  });
}

/**
 * Chat with the scheduling assistant (Gemini with smart Clinical Fallback).
 * @param {string} sessionId - unique session identifier
 * @param {string} userMessage - the user's message
 * @param {object} patientContext - profile of active logged in patient
 * @returns {Promise<string>} - the assistant's text reply
 */
async function chat(sessionId, userMessage, patientContext = null) {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  const isValidAiStudioKey = apiKey.length > 20 && apiKey !== "your_gemini_api_key_here";

  // If the key is missing or still the placeholder, use the clinical fallback
  if (!isValidAiStudioKey) {
    return handleClinicalFallback(sessionId, userMessage, patientContext);
  }

  try {
    let chatSession = sessions.get(sessionId);

    if (!chatSession) {
      const model = getModel();
      chatSession = model.startChat({ history: [] });
      sessions.set(sessionId, chatSession);
    }

    // Format message with patient context if first interaction
    let messageToSend = userMessage;
    if (patientContext && typeof patientContext === "object") {
      messageToSend = `[ACTIVE PATIENT ON RECORD: Name: ${patientContext.name}, Phone: ${patientContext.phone}, Allergies: ${(patientContext.allergies || []).join(", ") || "None"}, Symptoms: ${(patientContext.commonSymptoms || []).join("; ") || "None"}]\n\nPatient message: ${userMessage}`;
    }

    let result = await chatSession.sendMessage(messageToSend);
    let response = result.response;

    // Function-calling loop: keep going while Gemini requests tool calls
    while (true) {
      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts || [];

      // Collect all function calls in this response
      const functionCalls = parts.filter((p) => p.functionCall);

      if (functionCalls.length === 0) {
        break;
      }

      // Execute each function call and build response parts
      const functionResponses = functionCalls.map((part) => {
        const { name, args } = part.functionCall;
        const fn = toolImplementations[name];
        const fnResult = fn ? fn(args) : { success: false, message: `Unknown tool: ${name}` };
        return {
          functionResponse: {
            name,
            response: fnResult,
          },
        };
      });

      result = await chatSession.sendMessage(functionResponses);
      response = result.response;
    }

    return response.text();
  } catch (err) {
    console.warn("Gemini API call failed, activating graceful clinical scheduler fallback:", err.message);
    return handleClinicalFallback(sessionId, userMessage, patientContext);
  }
}

module.exports = { chat };
