import * as React from "react";

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
}

export class LobbyPage extends React.PureComponent<LobbyPageProps, LobbyPageState> {
    public state: LobbyPageState = {
        currentSection: undefined,
    };

    public render () {
        const menuSectionButtons = [
            MenuSection.Stats,
            MenuSection.Settings,
            MenuSection.Rules,
            MenuSection.About,
        ];

        const leftColumn: MenuButtonProps[] = [
            {
                value: "Resume",
                disabled: !this.props.hasCurrentGame,
                onClick: this.props.hasCurrentGame ? this.props.returnToGame : () => {},
            },
            {
                value: "Easy",
                onClick: () => this.props.generateGame({ difficulty: GameDifficulty.Easy }),
            },
            {
                value: "Medium",
                onClick: () => this.props.generateGame({ difficulty: GameDifficulty.Medium }),
            },
            {
                value: "Hard",
                onClick: () => this.props.generateGame({ difficulty: GameDifficulty.Hard }),
            },
        ];

        const rightColumn: MenuButtonProps[] = menuSectionButtons.map((section: MenuSection) => ({
            value: section,
            onClick: () => this.setState({ currentSection: section }),
        }));

        return (
            <div className={`lobby ${this.props.hidden ? "hidden" : ""}`}>
                <div className="lobby-wrapper">
                    <MainMenu rightColumn={rightColumn} leftColumn={leftColumn} />
                    {this.getSectionComponent()}
                </div>
            </div>
        );
    }

    private getSectionComponent = () => {
        if (!this.state.currentSection) {
            return null;
        }

        const Component = mapMenuSectionToComponent[this.state.currentSection];
        const crossOnClick = () => this.setState({ currentSection: undefined });
        const hasSubSection = [
            MenuSection.About,
            MenuSection.Contacts,
        ].includes(this.state.currentSection);

        const arrowOnClick = !hasSubSection
            ? () => undefined
            : () => {
                switch (this.state.currentSection) {
                case MenuSection.About:
                    this.setState({ currentSection: MenuSection.Contacts });
                    break;
                case MenuSection.Contacts:
                    this.setState({ currentSection: MenuSection.About });
                    break;
                default:
                    break;
                }
            }
        ;

        return (
            <Component
                crossOnClick={crossOnClick}
                arrowOnClick={arrowOnClick}
            />
        );
    }
}