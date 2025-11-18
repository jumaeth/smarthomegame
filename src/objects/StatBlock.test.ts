import {StatsKeys} from "./StatsKeys";
import {StatBlock} from "./StatBlock";

describe('StatBlock', () => {
  let statBlock: StatBlock;
  const TEST_KEY = 'testKey';
  const TEST_VALUE_1 = 'testValue';
  const TEST_VALUE_2 = 'testValue2';
  beforeEach(() => {
    statBlock = new StatBlock;
    statBlock.setValue(TEST_KEY, TEST_VALUE_1);
    statBlock.setValue(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS, TEST_VALUE_2);
  });

  it('statBlock.findByName should return the corect value', () => {
    expect(statBlock.findByName(TEST_KEY)).toBe(TEST_VALUE_1);
    expect(statBlock.findByName(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS)).toBe(TEST_VALUE_2);
    expect(statBlock.findByName("")).toBe("");
  });

  it('statBlock.setValue updates value correctly', () => {
    statBlock.setValue(TEST_KEY, TEST_VALUE_2);
    statBlock.setValue(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS, TEST_VALUE_1);

    expect(statBlock.findByName(TEST_KEY)).toBe(TEST_VALUE_2);
    expect(statBlock.findByName(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS)).toBe(TEST_VALUE_1);
  });

  it('statBlock.setValue inserts new value correctly', () => {
    const NEW_KEY = "newKey";
    expect(statBlock.findByName(NEW_KEY)).toBe("");
    statBlock.setValue(NEW_KEY, TEST_VALUE_2);
    expect(statBlock.findByName(NEW_KEY)).toBe(TEST_VALUE_2);
  });


  it('startTimer erhöht die Sitzungsanzahl', () => {
    const localStatBlock = new StatBlock();
    expect(localStatBlock.findByName(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS)).toBe("");
    localStatBlock.startTimer();
    expect(localStatBlock.findByName(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS)).toBe("1");
    localStatBlock.startTimer();
    expect(localStatBlock.findByName(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS)).toBe("1");
    localStatBlock.stopTimer()
    localStatBlock.startTimer();
    expect(localStatBlock.findByName(StatsKeys.AMOUNT_OF_DEVICE_SESSIONS)).toBe("2");
  });

  it('stopTimer wirft Fehler, wenn Timer nicht gestartet wurde', () => {
    expect(() => statBlock.stopTimer()).toThrow("Timer was not started.");
  });

});