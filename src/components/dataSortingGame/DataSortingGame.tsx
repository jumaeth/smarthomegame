import React, { useEffect, useState } from 'react';
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { Icons } from "@/components/icons.tsx";

interface DataSortingGameProps {
  onCompletion: (privacyPoints: number, comfortPoints: number) => void;
}

export const DataSortingGame: React.FC<DataSortingGameProps> = ({ onCompletion }) => {

  // Scoring knobs (tune to taste)
  const SCORE = {
    amountOfWrongAnswersAllowed: 2,
    baseComfortOnCorrect: 1,
    privacyOnCorrect: {
      public: 0.25,
      personal: 1,
      sensitive: 1.5,
    } as const,
    perfectRunPrivacyBonus: 1,
    // Completion bonus scales with performance
    completionBonus: () => {
      const firstTryCount = calculateFirstTrySuccesses();
      const total = dataItemsState.length;
      let privacy: number = 0;
      let comfort: number = 0;

      dataItemsState.forEach(item => {
        let attemptsModifier = 1;
        if (item.wrongAnswersRemaining === 1) {
          attemptsModifier = 0.5;
        } else if (item.wrongAnswersRemaining < 1) {
          attemptsModifier = 0;
        }

        comfort = comfort + attemptsModifier;

        privacy = privacy + SCORE.privacyOnCorrect[item.type] * attemptsModifier;
      })
      if (firstTryCount === total) {
        privacy = privacy + SCORE.perfectRunPrivacyBonus;
      }


      return { privacy, comfort };
    },
  };

  function calculateFirstTrySuccesses(): number {
    return dataItemsState.filter(item => item.wrongAnswersRemaining === SCORE.amountOfWrongAnswersAllowed).length;
  }

  // Define the data types and their corresponding colors and explanations
  const DATA_TYPES = {
    public: {
      label: t`Publicly accessible data`,
      color: 'bg-green-700',
      description: t`Data that is intended for the general public and does not contain any personal information`,
      explanation: t`Publicly accessible data belongs to the green field. This data is visible to anyone and usually does not contain any personal information. It can be shared freely, as it does not raise any privacy concerns.`
    },
    personal: {
      label: t`Personal data`,
      color: 'bg-orange-600',
      description: t`Personal information that may become sensitive when combined with other data`,
      explanation: t`Personal data belongs to this orange section here. It can be used to identify you, especially when combined with other information, and should therefore be protected.`
    },
    sensitive: {
      label: t`Personal data of special categories`,
      color: 'bg-red-700',
      description: t`Data that requires enhanced protection under European data-protection law (GDPR)`,
      explanation: t`This red section covers particularly sensitive data and requires the highest level of protection under the GDPR. Particularly sensitive data may tell us somethings about your biometrics, health status, ethnic origin, or political opinions.`
    }
  } as const;

  type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

  type DataItem = {
    id: number;
    text: string;
    type: keyof typeof DATA_TYPES;
    icon: Icon;
    explanation: string;
    wrongAnswersRemaining: number;
  };

  // Sample data items to sort
  const DATA_ITEMS: DataItem[] = [
    // Sensitive data examples
    {
      id: 1,
      text: t`Results of my last blood test`,
      type: 'sensitive',
      icon: Icons.bltest,
      explanation: t`Health data is particularly worthy of protection under the GDPR, as it contains very personal information and could be misused or used against you.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 2,
      text: t`Copy of my fingerprint scan for unlocking my laptop`,
      type: 'sensitive',
      icon: Icons.fingerprint,
      explanation: t`Biometric data like fingerprints are unique characteristics of a person and cannot be changed, so they need special protection, as they are closely tied to fundamental rights such as privacy and personal identity.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 3,
      text: t`DNA test results "genetics.zip"`,
      type: 'sensitive',
      icon: Icons.dna,
      explanation: t`Genetic data is particularly sensitive, as it is a unique identifier. It can hold information on your health status and may not only affect the person concerned but also their relatives.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 4,
      text: t`Religious denomination: Buddhism`,
      type: 'sensitive',
      icon: Icons.belief,
      explanation: t`Religious beliefs are particularly worthy of protection as they may lead to discrimination.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 5,
      text: t`Test result from political opinion calculator`,
      type: 'sensitive',
      icon: Icons.speech,
      explanation: t`Political opinions are particularly worthy of protection, as they may lead to discrimination or undue influence.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 6,
      text: t`Your "Best Worker's Union" member number: BEST 33 444 789 00`,
      type: 'sensitive',
      icon: Icons.hand,
      explanation: t`Trade union membership is particularly worthy of protection as it can reveal your political or ideological alignment. Such information may be misused for retaliation, profiling or discrimination.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 7,
      text: t`Racial and ethnic origin`,
      type: 'sensitive',
      icon: Icons.house,
      explanation: t`This data is especially sensitive, as it could be misused for discrimination.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 8,
      text: t`James Smart , Best Avenue 1, 12345 San Smartico`,
      type: 'personal',
      icon: Icons.adr,
      explanation: t`Name and address are personal data that can lead to the identification of a natural person.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 9,
      text: t`user123@best-email.com`,
      type: 'personal',
      icon: Icons.mail,
      explanation: t`Email addresses are personal data that can be used to contact you. However, they might be abused to send you spam or scams`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 10,
      text: t`Dad's phone nr: 00 12 567 890`,
      type: 'personal',
      icon: Icons.nmbr,
      explanation: t`Phone numbers are personal data that can be used for identification and contact purposes.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 11,
      text: t`My birthday! 01.01.2012`,
      type: 'personal',
      icon: Icons.birth,
      explanation: t`Your date of birth not only shows others how old you are, but is also used by your doctor, bank, or insurance to verify your identity alongside your name.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 12,
      text: t`MyCreditCard Number 0123 045 078 099`,
      type: 'personal',
      icon: Icons.card,
      explanation: t`Bank details are personal data that need special protection, as they are used for financial transactions and could be easily misused if stolen.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 13,
      text: t`My IP address: 203.0.113.45`,
      type: 'personal',
      icon: Icons.ip,
      explanation: t`IP addresses are personal data that can be used to identify a device and thus indirectly a person.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 14,
      text: t`My Smart Home's location: 12.3456, 23.4567`,
      type: 'personal',
      icon: Icons.gps,
      explanation: t`Location data is personal information that can provide information about movement patterns and whereabouts.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 15,
      text: t`City festival schedule on a flyer`,
      type: 'public',
      icon: Icons.event,
      explanation: t`Public event announcements are accessible to everyone and should not contain any personal information.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 16,
      text: t`City announcement: “Water maintenance works are planned for tomorrow morning.”`,
      type: 'public',
      icon: Icons.announ,
      explanation: t`Official announcements are public information that is accessible to everyone.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 17,
      text: t`Timetable for bus route 10`,
      type: 'public',
      icon: Icons.bus,
      explanation: t`Public transport information is accessible to everyone and does not contain any personal data.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 18,
      text: t`Weather forecast for San Smartico: 18’C, rain`,
      type: 'public',
      icon: Icons.rain,
      explanation: t`Weather data is public information that does not contain any personal references.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 19,
      text: t`Population of San Smartico by district 2024`,
      type: 'public',
      icon: Icons.data,
      explanation: t`Public statistics are aggregated data without personal reference.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    },
    {
      id: 20,
      text: t`Google Maps`,
      type: 'public',
      icon: Icons.map,
      explanation: t`Public maps do not contain any personal information and are accessible to everyone.`,
      wrongAnswersRemaining: SCORE.amountOfWrongAnswersAllowed
    }
  ];

  const [dataItemsState] = useState<DataItem[]>(
    () => DATA_ITEMS.map(item => ({ ...item })) // defensive Kopie
  );

  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    explanation: string
  } | null>(null);
  const [remainingItems, setRemainingItems] = useState<DataItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!isInitialized) {
      const shuffled = [...dataItemsState].sort(() => Math.random() - 0.5);
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
    e.dataTransfer.setData('text/plain', JSON.stringify(item.id));
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
    const dataItemId = JSON.parse(e.dataTransfer.getData('text/plain')) as number;
    const currentItem: DataItem = dataItemsState.find(item => item.id === dataItemId)!;
    const isCorrect = currentItem.type === type;

    if (isCorrect) {
      setRemainingItems(prev => prev.filter(item => item.id !== currentItem.id));
    } else {
      currentItem.wrongAnswersRemaining = currentItem.wrongAnswersRemaining - 1;
    }

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect ? t`Correct! ✅` : t`🚫 Not quite... Try again.`,
      explanation: isCorrect ? currentItem.explanation : DATA_TYPES[type].explanation
    });
  };

  const handleCloseFeedback = () => setFeedback(null);

  if (!isInitialized) return null;

  if (showSummary) {
    // Compute completion bonus once (pure calc; apply on click below)
    const bonus = SCORE.completionBonus();

    const handleFinish = () => {
      onCompletion(bonus.privacy, bonus.comfort);
    };

    // game result
    return (
      <div className="p-4 min-w-[600px] h-full flex flex-col items-center justify-center gap-8 bg-transparent font-mono text-center text-amber-900"
      >

        <div className="bg-white rounded-xl p-6 w-[100%] font-['LoResRegular',sans-serif]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl mb-6">
            <Trans>🎉 Congratulations! 🎉</Trans>
          </h1>

          <div className="space-y-6 mb-6">
            <div className="border-b border-gray-300 pb-4">
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
                <Trans>All items were sorted!</Trans>
              </p>
            </div>

            {calculateFirstTrySuccesses() > 0 && (
              <div className="border-b border-gray-300 pb-4">
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
                  <Trans>Answered correctly on the first attempt:</Trans> <span
                    style={{ textShadow: '1px 1px 3px rgba(120, 53, 15, 0.8)' }}>{calculateFirstTrySuccesses()}</span>
                  <Trans>of</Trans> <span
                    style={{ textShadow: '1px 1px 3px rgba(120, 53, 15, 0.8)' }}>{DATA_ITEMS.length}</span>
                </p>
              </div>
            )}

            <div className="border-b border-gray-300 pb-4">
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold">
                <Trans>Completion bonus:</Trans><span
                  style={{ textShadow: '1px 1px 3px rgba(120, 53, 15, 0.6)' }}> + {bonus.privacy}<Trans> privacy</Trans>, + {bonus.comfort}
                  <Trans>Comfort</Trans></span>
              </p>
            </div>
          </div>

          <p className="text-lg sm:text-xl mb-4">
            <Trans>Success! Your Smart Home Hub is now unlocked.</Trans>
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleFinish}
              className="px-10 py-2 text-white text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-[30px] shadow-md transition-colors cursor-pointer"
            >
              <Trans>Close</Trans>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // textblocks & blocks
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4"
    >
      <div className="flex justify-center w-full mt-4 md:mt-6 lg:mt-8 items-center">
        {currentItem && (
          (() => {
            const ItemIcon = currentItem.icon;
            return (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, currentItem)}
                className="w-[90%] sm:w-[70%] md:w-[60%] max-w-[600px] cursor-grab p-3 sm:p-4 md:p-5
                                        text-green-900 bg-gray-100 hover:bg-amber-100 rounded-lg shadow-md flex justify-center items-center"
              >
                <h6
                  className="text-lg sm:text-xl md:text-2xl"
                >
                  {currentItem.text}
                </h6>
                <ItemIcon className="h-8 w-8 text-green-900 ml-4 flex-shrink-0" />
              </div>
            );
          })()
        )}
      </div>

      {feedback && (
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        p-6 rounded-lg shadow-lg z-[100] text-black text-center max-w-sm ${feedback.type === 'success' ? 'bg-green-200' : 'bg-red-100'
            }`}
        >
          <h4
            className="font-semibold mb-2 text-2xl"
          >
            {feedback.message}
          </h4>

          <p className="mb-4">
            {feedback.explanation}
          </p>

          <button
            onClick={handleCloseFeedback}
            className="px-3 py-[10px] text-white bg-gray-600 text-lg font-semibold hover:bg-gray-700
                      rounded-xl shadow-md transition-colors cursor-pointer w-full"
          >
            <Trans>Close</Trans>
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6 lg:mt-8 flex-grow">
        {Object.entries(DATA_TYPES).map(([type, { label, color, description }]) => (
          <div
            key={type}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, type as keyof typeof DATA_TYPES)}
            className={`w-full md:w-1/3 p-4 rounded-lg shadow-md ${color} text-white min-h-[200px] min-w-[200px] flex flex-col items-center text-center`}
          >
            <h3 className="text-xl font-bold mb-2">{label}</h3>
            <p className="text-sm">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};