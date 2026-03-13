/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { retrieveJungianContexts } from "./rag/retriever.js";

/**
 * Tavily search tool configuration
 * This tool allows the agent to perform web searches using the Tavily API.
 */
const searchTavily = new TavilySearchResults({
  maxResults: 3,
});

const jungianKbSearch = tool(
  async ({ question, topK }: { question: string; topK?: number }) => {
    const { confidence, contexts } = await retrieveJungianContexts(
      question,
      topK ?? 4,
    );

    return {
      confidence,
      contexts,
      contextCount: contexts.length,
    };
  },
  {
    name: "jungian_kb_search",
    description:
      "Retrieve Jungian source excerpts relevant to the current journal entry analysis.",
    schema: z.object({
      question: z
        .string()
        .min(5)
        .describe("The retrieval query based on the user's journal entry."),
      topK: z
        .number()
        .int()
        .min(1)
        .max(8)
        .optional()
        .describe("Maximum number of chunks to retrieve. Default is 4."),
    }),
  },
);

/**
 * Export an array of all available tools
 * Add new tools to this array to make them available to the agent
 *
 * Note: You can create custom tools by implementing the Tool interface from @langchain/core/tools
 * and add them to this array.
 * See https://js.langchain.com/docs/how_to/custom_tools/#tool-function for more information.
 */
export const TOOLS = [jungianKbSearch, searchTavily];
