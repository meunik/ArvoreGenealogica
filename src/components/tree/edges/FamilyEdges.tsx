import { BaseEdge, getSmoothStepPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';

export function MarriageEdge(props: EdgeProps) {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    markerEnd,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 6,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      className="stroke-edge-marriage stroke-2"
    />
  );
}

export function CohabitationEdge(props: EdgeProps) {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    markerEnd,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 6,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      className="stroke-edge-marriage stroke-2"
      style={{ strokeDasharray: '6 3' }}
    />
  );
}

export function BloodParentalEdge(props: EdgeProps) {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    markerEnd,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 8,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      className="stroke-edge-blood stroke-[1.5]"
    />
  );
}

export function AdoptiveParentalEdge(props: EdgeProps) {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    markerEnd,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 8,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      className="stroke-edge-adoptive stroke-[1.5]"
      style={{ strokeDasharray: '5 3' }}
    />
  );
}

/** Edge for divorced/widowed parents who still share children — thin, dashed, muted */
export function SeparatedEdge(props: EdgeProps) {
  const {
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
  } = props;

  const [edgePath] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 6,
  });

  return (
    <BaseEdge
      path={edgePath}
      className="stroke-edge-divorce stroke-1 opacity-55"
      style={{ strokeDasharray: '5 4' }}
    />
  );
}
