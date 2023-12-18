import i18next from "i18next";
import { Icon, Button, Popup } from "semantic-ui-react";

import { login, logout } from "../utils/firebase";

import useLocales from "../locales/useLocales";

import Tooltip from "../components/Tooltip";

function Header({ isLogged }) {
  const { translate, currentLanguage, changeLanguage } = useLocales();

  return (
    <div className="header">
      <Button.Group floated="right">
        <Tooltip
          title={translate("tooltip.change.language")}
          content={
            <Button
              size="small"
              circular
              basic
              icon={
                <Icon
                  name="language"
                  size="large"
                  onClick={() => {
                    if (currentLanguage === "cn") {
                      changeLanguage("en");
                    } else {
                      changeLanguage("cn");
                    }
                  }}
                />
              }
            />
          }
        />
        {!isLogged ? (
          <Tooltip
            title={translate("tooltip.login")}
            content={
              <Button
                size="small"
                circular
                basic
                icon={<Icon name={"sign-in"} size="large" onClick={login} />}
              />
            }
          />
        ) : (
          <Tooltip
            title={translate("tooltip.logout")}
            content={
              <Button
                size="small"
                circular
                basic
                icon={<Icon name={"sign-out"} size="large" onClick={logout} />}
              />
            }
          />
        )}
      </Button.Group>
    </div>
  );
}

export default Header;
