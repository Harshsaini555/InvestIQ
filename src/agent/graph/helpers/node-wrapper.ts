import { type GraphState, type NodeStatusType } from '../state/GraphState';
import { logger } from '@/utils/logger';

/**
 * Higher-order helper to wrap node execution.
 * Handles timing, error mapping, execution metadata logging, and tracking.
 */
export function createGraphNode(
  nodeName: string,
  executeFn: (state: GraphState) => Promise<Partial<GraphState>>
) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    const startTime = Date.now();
    const startedAtIso = new Date().toISOString();

    logger.info(`Node execution started`, { node: nodeName, company: state.companyName });

    // Update state to running
    const runningUpdate: Partial<GraphState> = {
      executionMetadata: {
        ...state.executionMetadata,
        currentNode: nodeName,
      },
      nodeStatus: {
        ...state.nodeStatus,
        [nodeName]: 'running' as NodeStatusType,
      },
      timestamps: {
        ...state.timestamps,
        [nodeName]: { startedAt: startedAtIso, completedAt: null },
      },
    };

    try {
      // Execute the node logic
      const result = await executeFn({ ...state, ...runningUpdate });
      const duration = Date.now() - startTime;
      const completedAtIso = new Date().toISOString();

      logger.info(`Node execution succeeded`, { node: nodeName, durationMs: duration, company: state.companyName });

      return {
        ...result,
        executionMetadata: {
          ...state.executionMetadata,
          currentNode: null,
          completedNodes: [...state.executionMetadata.completedNodes, nodeName],
          nodeDurations: {
            ...state.executionMetadata.nodeDurations,
            [nodeName]: duration,
          },
        },
        nodeStatus: {
          ...state.nodeStatus,
          [nodeName]: 'complete' as NodeStatusType,
        },
        timestamps: {
          ...state.timestamps,
          [nodeName]: { startedAt: startedAtIso, completedAt: completedAtIso },
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const completedAtIso = new Date().toISOString();
      const errorMessage = error instanceof Error ? error.message : String(error);

      logger.error(`Node execution failed`, {
        node: nodeName,
        durationMs: duration,
        error: errorMessage,
        company: state.companyName,
      });

      return {
        executionMetadata: {
          ...state.executionMetadata,
          currentNode: null,
          failedNodes: [...state.executionMetadata.failedNodes, nodeName],
          nodeDurations: {
            ...state.executionMetadata.nodeDurations,
            [nodeName]: duration,
          },
        },
        nodeStatus: {
          ...state.nodeStatus,
          [nodeName]: 'failed' as NodeStatusType,
        },
        errors: {
          ...state.errors,
          [nodeName]: errorMessage,
        },
        timestamps: {
          ...state.timestamps,
          [nodeName]: { startedAt: startedAtIso, completedAt: completedAtIso },
        },
      };
    }
  };
}
