import { beforeEach, describe, expect, test } from 'vitest'
import { timeToMilliseconds, timeToString, type Time } from '../../src/utils/time'

interface TimeContext {
    time: Time;
}

beforeEach<TimeContext>(async (context) => {
    context.time = {
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
    };
});

describe("timeToMilliseconds", () => {
  test<TimeContext>("should return the right value", ({ time }) => {
    const result = timeToMilliseconds(time);

    expect(result).toBe(93784000);
  });

  test("should work without putting all the values", () => {
    const time = { seconds: 7 };

    const result = timeToMilliseconds(time);

    expect(result).toBe(7000);
  });

  test("should work without putting any value", () => {
    const time = {};

    const result = timeToMilliseconds(time);

    expect(result).toBe(0);
  });
});

describe("timeToString", () => {
  test<TimeContext>("should return the right value", ({ time }) => {
    const result = timeToString(time);
    
    expect(result).toBe("1 jour 2 heures 3 minutes 4 secondes");
  });
    
  test("should work without putting all the values", () => {
    const time = { seconds: 7 };
    
    const result = timeToString(time);

    expect(result).toBe("7 secondes");
  });
    
  test("should work without putting any value", () => {
    const time = {};
    
    const result = timeToString(time);
    
    expect(result).toBe("");
  });
});