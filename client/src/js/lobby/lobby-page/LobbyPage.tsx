import React, { useState, useCallback } from "react";
import cx from "classnames";
import "./lobbyPage.less";

import { MainMenu } from "../../components/main-menu/MainMenu";
import {
  MenuSection,
  SharedSectionProps,
} from "../../components/menu-content/types";
import { SettingsSection } from "../../components/menu-content/SettingsSection";
import { RulesSection } from "../../components/menu-content/RulesSection";
import { ContactsSection } from "../../components/menu-content/ContactsSection";
import { StatsSection } from "../../components/menu-content/StatsSection";
import { AboutSection } from "../../components/menu-content/AboutSection";
import { MenuButtonProps } from "../../components/buttons/Button";
import { GameConfig, GameDifficulty } from "../../consts";

type MapMenuSectionToComponentIndexSignature = {
  [k in MenuSection]: React.ComponentClass<SharedSectionProps>;
};

const mapMenuSectionToComponent: MapMenuSectionToComponentIndexSignature = {
  [MenuSection.Stats]: StatsSection,
  [MenuSection.Settings]: SettingsSection,
  [MenuSection.Rules]: RulesSection,
  [MenuSection.About]: AboutSection,
  [MenuSection.Contacts]: ContactsSection,
};

export interface LobbyPageState {
  currentSection?: MenuSection;
}

export interface LobbyPageProps {
  hasCurrentGame: boolean;
  generateGame: (props: GameConfig) => void;
  returnToGame: () => void;
  hidden: boolean;
  isLoading: boolean;
}

const menuSectionButtons = [
  MenuSection.Stats,
  MenuSection.Settings,
  MenuSection.Rules,
  MenuSection.About,
];

export const LobbyPage: React.FC<LobbyPageProps> = ({
  hasCurrentGame,
  generateGame,
  returnToGame,
  hidden,
  isLoading,
}) => {
  const [currentSection, setCurrentSection] = useState<MenuSection | undefined>();
  const leftColumn: MenuButtonProps[] = [
    {
      value: "Resume",
      disabled: !hasCurrentGame,
      onClick: hasCurrentGame ? returnToGame : () => {},
    },
    {
      value: "Easy",
      onClick: () => generateGame({ difficulty: GameDifficulty.Easy }),
    },
    {
      value: "Medium",
      onClick: () => generateGame({ difficulty: GameDifficulty.Medium }),
    },
    {
      value: "Hard",
      onClick: () => generateGame({ difficulty: GameDifficulty.Hard }),
    },
  ];
  const rightColumn: MenuButtonProps[] = menuSectionButtons.map((section: MenuSection) => ({
    value: section,
    onClick: () => setCurrentSection(section),
  }));

  const getSectionComponent = useCallback(() => {
    if (!currentSection) {
      return null;
    }

    const Component = mapMenuSectionToComponent[currentSection];
    const setSubSection = () => {
      if (currentSection === MenuSection.About) {
        setCurrentSection(MenuSection.Contacts);
        return;
      }
      if (currentSection === MenuSection.Contacts) {
        setCurrentSection(MenuSection.About);
        return;
      }
    };

    return (
      <Component
        crossOnClick={() => setCurrentSection(undefined)}
        arrowOnClick={setSubSection}
      />
    );
  }, [currentSection]);

  return (
    <div className={cx("lobby", hidden && "hidden")}>
      <div className="lobby-wrapper">
        <MainMenu rightColumn={rightColumn} leftColumn={leftColumn} isLoading={isLoading} />
        {!isLoading && getSectionComponent()}
      </div>
    </div>
  );
};
