import {i18n} from "@lingui/core";
import {setLocaleCookie} from "@/utils/cookie/languageCookie.ts";
import {useState} from "react";
import Button from "@/components/general-ui/Button.tsx";

const LanguageSwitcher = () => {
  type LanguageOption = {
    locale: string;
    label: string;
  }
  const options: LanguageOption[] = [
    {locale: "en", label: "English"},
    {locale: "de", label: "Deutsch"}
  ]
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options.find(option => option.locale === i18n.locale) || options[0]);
  const handleChange = (selectedOption: LanguageOption) => {
    i18n.activate(selectedOption.locale);
    setLocaleCookie(selectedOption.locale);
    setSelected(selectedOption);
    setIsOpen(false);
  };


  return (
          <div className="relative inline-block">
            <Button onClick={(): void => setIsOpen(!isOpen)}>{`${selected.label} ▼`}</Button>
            {isOpen && (
                    <div className="absolute">
                      {options.map(option => (
                              <Button className={"w-full bg-gray-900 border-2 border-white"}
                                      onClick={(): void => handleChange(option)}>{option.label}</Button>
                      ))}
                    </div>
            )}
          </div>
  );
};

export default LanguageSwitcher;