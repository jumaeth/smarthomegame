export type Solution = {
  booleanSolution: boolean,
  solutionMessage: string,
  privacyScoreGain: number,
  comfortScoreGain: number,
  privacyScorePenalty: number,
  comfortScorePenalty: number,
}

export function newSolution(
        booleanSolution: boolean,
        solutionMessage: string,
        privacyScoreGain: number,
        comfortScoreGain: number,
        privacyScorePenalty: number,
        comfortScorePenalty: number,
): Solution {
  return {
    booleanSolution,
    solutionMessage,
    privacyScoreGain,
    comfortScoreGain,
    privacyScorePenalty,
    comfortScorePenalty,
  };
}