import React, { useState, useEffect } from 'react';
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { useGameService } from "@/hooks/gameService/useGameService.tsx";

interface DataSortingGameProps {
  onCompletion: () => void;
}

export const DataSortingGame: React.FC<DataSortingGameProps> = ({ onCompletion }) => {
  const gameService = useGameService();

  // Scoring knobs (tune to taste)
  const SCORE = {
    baseComfortOnCorrect: 1,
    privacyOnCorrect: {
      public: 1,
      personal: 2,
      sensitive: 3,
    } as const,
    firstTryBonusPrivacy: 1,
    // Completion bonus scales with performance
    completionBonus: (firstTryCount: number, total: number) => {
      const accuracy = firstTryCount / total; // 0..1
      const privacy = Math.round(4 * accuracy * total / 10);  // ~ up to +4 for perfect run
      const comfort = Math.round(3 * accuracy * total / 10);  // ~ up to +3 for perfect run
      return { privacy, comfort };
    },
  };

  // Define the data types and their corresponding colors and explanations
  const DATA_TYPES = {
    public: {
      label: t`Publicly accessible data`,
      color: 'bg-green-700',
      description: t`Data that is intended for the general public and does not contain any personal information`,
      explanation: t`This data is publicly accessible and does not contain any personal information. It can be shared freely as it does not raise any privacy concerns.`
    },
    personal: {
      label: t`Personal data`,
      color: 'bg-orange-600',
      description: t`Personal information that can become sensitive when combined with other data`,
      explanation: t`This data is personal, but not highly sensitive. It can lead to identification and should be protected, especially if it is combined with other information.`
    },
    sensitive: {
      label: t`Personal data of special categories`,
      color: 'bg-red-700',
      description: t`Data that requires a higher level of protection under the GDPR`,
      explanation: t`This data is particularly sensitive and requires the highest level of protection under the GDPR. It includes genetic, biometric and health data as well as information on racial and ethnic origin, political opinions, religious beliefs or trade union membership.`
    }
  } as const;

  type DataItem = {
    id: number;
    text: string;
    type: keyof typeof DATA_TYPES;
    explanation: string;
  };

  // Sample data items to sort
  const DATA_ITEMS: DataItem[] = [
    // Sensitive data examples
    {
      id: 1,
      text: t`Health data (e.g., medical history)`,
      type: 'sensitive',
      explanation: t`Health data is particularly worthy of protection under the GDPR, as it contains very personal information and could be misused.`
    },
    {
      id: 2,
      text: t`Biometric data (e.g., fingerprints)`,
      type: 'sensitive',
      explanation: t`Biometric data are unique characteristics of a person and cannot be changed, so they require special protection.`
    },
    {
      id: 3,
      text: t`Genetic data`,
      type: 'sensitive',
      explanation: t`Genetic data is particularly sensitive as it can affect not only the person concerned but also their relatives.`
    },
    {
      id: 4,
      text: t`Religious beliefs`,
      type: 'sensitive',
      explanation: t`Religious beliefs are particularly worthy of protection as they could lead to discrimination.`
    },
    {
      id: 5,
      text: t`Political opinions`,
      type: 'sensitive',
      explanation: t`Political opinions are particularly worthy of protection as they could lead to discrimination or influence.`
    },
    {
      id: 6,
      text: t`Trade union membership`,
      type: 'sensitive',
      explanation: t`Trade union membership is particularly worthy of protection as it could lead to workplace discrimination.`
    },
    {
      id: 7,
      text: t`Racial and ethnic origin`,
      type: 'sensitive',
      explanation: t`This data is particularly worthy of protection as it could lead to discrimination.`
    },

    // Personal data examples
    {
      id: 8,
      text: t`Name and address`,
      type: 'personal',
      explanation: t`Name and address are personal data that can lead to the identification of a person.`
    },
    {
      id: 9,
      text: t`Email address`,
      type: 'personal',
      explanation: t`Email addresses are personal data that can be used for identification and contact purposes.`
    },
    {
      id: 10,
      text: t`Phone number`,
      type: 'personal',
      explanation: t`Phone numbers are personal data that can be used for identification and contact purposes.`
    },
    {
      id: 11,
      text: t`Date of birth`,
      type: 'personal',
      explanation: t`The date of birth is personal information that can contribute to identification.`
    },
    {
      id: 12,
      text: t`Bank details`,
      type: 'personal',
      explanation: t`Bank details are personal data that require special protection as they are used for financial transactions.`
    },
    {
      id: 13,
      text: t`IP address`,
      type: 'personal',
      explanation: t`IP addresses are personal data that can be used to identify a device and thus indirectly a person.`
    },
    {
      id: 14,
      text: t`Location data`,
      type: 'personal',
      explanation: t`Location data is personal information that can provide information about movement patterns and whereabouts.`
    },

    // Public data examples
    {
      id: 15,
      text: t`Public event information`,
      type: 'public',
      explanation: t`Public event announcements are accessible to everyone and do not contain any personal information.`
    },
    {
      id: 16,
      text: t`Official announcements`,
      type: 'public',
      explanation: t`Official announcements are public information that is accessible to all citizens.`
    },
    {
      id: 17,
      text: t`Public transport information`,
      type: 'public',
      explanation: t`Public transport information is accessible to everyone and does not contain any personal data.`
    },
    {
      id: 18,
      text: t`Weather data`,
      type: 'public',
      explanation: t`Weather data is public information that does not contain any personal references.`
    },
    {
      id: 19,
      text: t`Public statistics`,
      type: 'public',
      explanation: t`Public statistics are aggregated data without personal reference.`
    },
    {
      id: 20,
      text: t`Public maps`,
      type: 'public',
      explanation: t`Public maps do not contain any personal information and are accessible to everyone.`
    }
  ];

  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string; explanation: string } | null>(null);
  const [remainingItems, setRemainingItems] = useState<DataItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [firstTrySuccesses, setFirstTrySuccesses] = useState<DataItem[]>([]);
  const [attemptedItems, setAttemptedItems] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!isInitialized) {
      const shuffled = [...DATA_ITEMS].sort(() => Math.random() - 0.5);
      setRemainingItems(shuffled);
      setCurrentItem(shuffled[0]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update current item when remaining items change
  useEffect(() => {
    if (remainingItems.length > 0) {
      setCurrentItem(remainingItems[0]);
    } else if (remainingItems.length === 0 && isInitialized) {
      setShowSummary(true);
    }
  }, [remainingItems, isInitialized]);

  const handleDragStart = (e: React.DragEvent, item: DataItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-amber-800', 'bg-amber-100');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-amber-800', 'bg-amber-100');
  };

  const handleDrop = (e: React.DragEvent, type: keyof typeof DATA_TYPES) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-amber-800', 'bg-amber-100');

    const item = JSON.parse(e.dataTransfer.getData('text/plain')) as DataItem;
    const isCorrect = item.type === type;

    // Track attempts & first-try
    const isFirstAttempt = !attemptedItems.has(item.id);
    setAttemptedItems(prev => new Set([...prev, item.id]));

    if (isCorrect) {
      setRemainingItems(prev => prev.filter(i => i.id !== item.id));
      if (isFirstAttempt) setFirstTrySuccesses(prev => [...prev, item]);

      // Award per-correct deltas
      const privacyDelta = SCORE.privacyOnCorrect[item.type] + (isFirstAttempt ? SCORE.firstTryBonusPrivacy : 0);
      const comfortDelta = SCORE.baseComfortOnCorrect;

      gameService.changeScore(privacyDelta, 'privacy');
      gameService.changeScore(comfortDelta, 'comfort');
    } else {
      // No penalty by default; uncomment to add gentle penalties
      // gameService.changeScore(0, 'privacy');
      // gameService.changeScore(0, 'comfort');
    }

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect ? t`Correct!` : t`Wrong! Try again.`,
      explanation: isCorrect ? item.explanation : DATA_TYPES[type].explanation
    });
  };

  const handleCloseFeedback = () => setFeedback(null);

  if (!isInitialized) return null;

  if (showSummary) {
    // Compute completion bonus once (pure calc; apply on click below)
    const bonus = SCORE.completionBonus(firstTrySuccesses.length, DATA_ITEMS.length);

    const handleFinish = () => {
      gameService.changeScore(bonus.privacy, 'privacy');
      gameService.changeScore(bonus.comfort, 'comfort');
      onCompletion();
    };

    return (
            <div className="p-4 md:p-6 lg:p-8 w-full h-full flex flex-col items-center justify-center gap-8 bg-amber-600 font-mono text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-white mb-4">
                <Trans>Congratulations!</Trans>
              </h2>

              <div className="bg-white/90 rounded-xl p-6 max-w-[600px] w-[90%]">
                <h3 className="text-xl sm:text-2xl md:text-3xl text-amber-900 mb-4">
                  <Trans>Summary</Trans>
                </h3>

                <p className="text-lg sm:text-xl md:text-2xl text-amber-900 mb-6">
                  <Trans>All items were sorted successfully!</Trans>
                </p>

                {firstTrySuccesses.length > 0 && (
                        <p className="text-base sm:text-lg text-amber-900 mb-2">
                          <Trans>Answered correctly on the first attempt:</Trans> {firstTrySuccesses.length} <Trans>of</Trans> {DATA_ITEMS.length}
                        </p>
                )}

                <p className="text-base sm:text-lg text-amber-900 mb-6">
                  <Trans>Completion bonus:</Trans> +{bonus.privacy} <Trans>privacy</Trans>, +{bonus.comfort} <Trans>comfort</Trans>
                </p>

                <p className="text-base sm:text-lg md:text-xl text-amber-900 mb-8">
                  <Trans>The Smart Home Hub is now unlocked!</Trans>
                </p>

                <div className="flex justify-center">
                  <button
                          onClick={handleFinish}
                          className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl transition-colors"
                  >
                    <Trans>Completed</Trans>
                  </button>
                </div>
              </div>
            </div>
    );
  }

  return (
          <div
                  className="p-4 md:p-6 lg:p-8 w-full h-full flex flex-col gap-4 md:gap-6 lg:gap-8 bg-amber-600 relative"
                  style={{ fontFamily: 'LoResRegular, sans-serif' }}
          >
            <div className="flex justify-center w-full h-32 mt-4 md:mt-6 lg:mt-8">
              {currentItem && (
                      <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, currentItem)}
                              className="w-[90%] sm:w-[70%] md:w-[60%] max-w-[600px] cursor-grab p-3 sm:p-4 md:p-5 text-amber-900 bg-white rounded-lg shadow-md"
                      >
                        <h6
                                className="text-lg sm:text-xl md:text-2xl"
                                style={{ fontFamily: 'LoResRegular, sans-serif' }}
                        >
                          {currentItem.text}
                        </h6>
                      </div>
              )}
            </div>

            {feedback && (
                    <div
                            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg z-10 ${
                                    feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                            }`}
                    >
                      <p
                              className={`text-lg font-semibold ${
                                      feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
                              }`}
                      >
                        {feedback.message}
                      </p>
                      <p className="text-sm mt-2 text-gray-700 max-w-md">
                        {feedback.explanation}
                      </p>
                      <button
                              onClick={handleCloseFeedback}
                              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded w-full"
                              style={{ fontFamily: 'LoResBold, sans-serif' }}
                      >
                        <Trans>Close</Trans>
                      </button>
                    </div>
            )}

            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6 lg:mt-8">
              {Object.entries(DATA_TYPES).map(([type, { label, color, description }]) => (
                      <div
                              key={type}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, type as keyof typeof DATA_TYPES)}
                              className={`w-full md:w-1/3 p-4 rounded-lg ${color} text-white min-h-[200px] flex flex-col items-center justify-center text-center`}
                      >
                        <h3 className="text-xl font-bold mb-2">{label}</h3>
                        <p className="text-sm">{description}</p>
                      </div>
              ))}
            </div>
          </div>
  );
};
