import { parseLiveOptions } from "@/lib/option";
import { OptionArg, OptionSide, OptionType } from "@/types/option";

const fallbackOptions = [
  {
    type: OptionType.Call,
    side: OptionSide.Long,
    option: [
      "0",
      "1690502399",
      "4381101717506018508800",
      "2368576823837625528275935341135881659748932889268308403712618244410713532584",
      "2087021424722619777119509474943472645767659996348769578120564519014510906823",
      "0",
      "45605429834231123",
    ],
  },
  {
    type: OptionType.Put,
    side: OptionSide.Long,
    option: [
      "0",
      "1690502399",
      "4150517416584649113600",
      "2368576823837625528275935341135881659748932889268308403712618244410713532584",
      "2087021424722619777119509474943472645767659996348769578120564519014510906823",
      "1",
      "51068436118205306934",
    ],
  },
  {
    type: OptionType.Call,
    side: OptionSide.Short,
    option: [
      "1",
      "1690502399",
      "4381101717506018508800",
      "2368576823837625528275935341135881659748932889268308403712618244410713532584",
      "2087021424722619777119509474943472645767659996348769578120564519014510906823",
      "0",
      "38382705533623742",
    ],
  },
  {
    type: OptionType.Put,
    side: OptionSide.Short,
    option: [
      "1",
      "1690502399",
      "4150517416584649113600",
      "2368576823837625528275935341135881659748932889268308403712618244410713532584",
      "2087021424722619777119509474943472645767659996348769578120564519014510906823",
      "1",
      "39980988759162618435",
    ],
  },
];

export const getFallbackOption = (option: OptionArg) => {
  const rawOption = fallbackOptions.find(
    ({ type, side }) => option.side === side && option.type === type
  );

  if (!rawOption) return [];

  return parseLiveOptions(rawOption.option)[0];
};
