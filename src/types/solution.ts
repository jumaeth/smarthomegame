export type Solution = {
  booleanSolution: boolean,
  solutionCorrectMessage: string,
  solutionWrongMessage: string,
  privacyScoreGain: number,
  comfortScoreGain: number,
  privacyScorePenalty: number,
  comfortScorePenalty: number,
}

export function newSolution(
        booleanSolution: boolean,
        solutionCorrectMessage: string,
        solutionWrongMessage: string,
        privacyScoreGain: number,
        comfortScoreGain: number,
        privacyScorePenalty: number,
        comfortScorePenalty: number,
): Solution {
  return {
    booleanSolution,
    solutionCorrectMessage,
    solutionWrongMessage,
    privacyScoreGain,
    comfortScoreGain,
    privacyScorePenalty,
    comfortScorePenalty,
  };
}