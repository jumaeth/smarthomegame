import {i18n} from "@lingui/core";
import {setLocaleCookie} from "@/utils/cookie/languageCookie.ts";

const LanguageSwitcher = () => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = event.target.value;
    i18n.activate(locale);
    setLocaleCookie(locale);
  };

  return (
          <select onChange={handleChange} defaultValue={i18n.locale}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
  );
};

export default LanguageSwitcher;