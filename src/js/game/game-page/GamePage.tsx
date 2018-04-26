import * as React from "react";

import "./gamePage.less";

import { SideMenu } from "../../components/side-menu/SideMenu";
import { Popup, PopupProps } from "../../components/popup/Popup";
import {
    GameButton, 
    MenuButtonProps,
    GameButtonProps,
    GameButtonSize,
 } from "../../components/buttons/Button";
import { CoordinateTableX, CoordinateTableY } from "../../components/coordinates/Coordinates";
import { CellMode, TableCellsMap } from "../../consts";
import { arrowKeys, findCoordinates } from "../gameCells";
import { highlight, showDuplicates } from "../gameTable";
import { updateNotesCells } from "../gameNotesCells";
import { removeDuplicates } from "../../utils/generalUtils";
import { Game } from "../../generator";
import { checkSvg } from "../../components/svg/Icons";
import { SudokuTable } from "../../components/sudoku-table/SudokuTable";

export interface GamePageProps {
    hidden: boolean;
    game: Game;
    returnToLobby: () => void;
}

interface GamePageState {
    cellMode: CellMode;
    toggleSideMenu: boolean;
    popupProps: PopupProps;
    toggleCoordinates: boolean;
    cellProps: TableCellsMap;
}

export class GamePage extends React.Component<GamePageProps, GamePageState> {
    public state: GamePageState = {
        cellMode: CellMode.Pencil,
        toggleSideMenu: false,
        popupProps: {
            hidden: true,
        },
        toggleCoordinates: false,
        cellProps: {},
    };

    public componentWillMount () {
        this.assignValues(this.props.game.mask);
    }

    public componentWillUpdate (nextProps: GamePageProps, nextState: GamePageState) {
        if (this.props.hidden && !nextProps.hidden) {
            if (this.props.game.mask !== nextProps.game.mask) {
                this.assignValues(nextProps.game.mask);
            } else {
                this.resetState();
            }
        }
        if (this.state.cellMode !== nextState.cellMode) {
            this.handleCellModeChange();
        }
    }

    public render () {
        const sideMenuButtons: MenuButtonProps[] = [
            {
                value: "Return",
                onClick: this.props.returnToLobby,
            },
            {
                value: "Reset",
                onClick: this.enableResetPopup,
            },
            {
                value: "Check",
                onClick: () => this.checkForWin(this.state.cellProps, true),
            },
            {
                value: "Solve",
                onClick: this.enableSolvePopup,
            },
        ];

        return (
            <div className={["game", this.props.hidden ? "hidden" : null].join(" ")}>
                <SideMenu
                    hidden={!this.state.toggleSideMenu}
                    onClick={this.toggleSideMenu}
                    buttons={sideMenuButtons}
                />
                <Popup {...this.state.popupProps} />

                <div className="game-wrapper">
                    <CoordinateTableX hidden={!this.state.toggleCoordinates} />

                    <div className="center">
                        <CoordinateTableY hidden={!this.state.toggleCoordinates} />

                        <SudokuTable
                            cellState={this.state.cellProps}
                            gameType={this.props.game.gameType}
                        />

                        <div className="dummy-block"></div>
                    </div>

                    <div className="game-buttons">
                        <GameButton
                            value="Pencil"
                            onClick={this.setCellModePencil}
                            selected={this.state.cellMode === CellMode.Pencil}
                        />
                        <GameButton
                            value="Notes"
                            onClick={this.setCellModeNotes}
                            selected={this.state.cellMode === CellMode.Notes}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private resetState = () => {
        this.setState({
            cellMode: CellMode.Pencil,
            toggleSideMenu: false,
            popupProps: {
                ...this.state.popupProps,
                hidden: true,
            },
            toggleCoordinates: false,
        });
    }

    private toggleSideMenu = () => {
        this.setState({ toggleSideMenu: !this.state.toggleSideMenu });
    }

    private setCellModePencil = () => {
        this.setState({ cellMode: CellMode.Pencil });
    }

    private setCellModeNotes = () => {
        this.setState({ cellMode: CellMode.Notes });
    }

    private enableMessagePopup = (
        { text, buttons }: { text: JSX.Element, buttons: GameButtonProps[] },
        toggleCoordinates = false,
    ) => {
        this.setState({
            toggleCoordinates,
            popupProps: {
                text,
                buttons,
                hidden: false,
            },
        });
    }

    private disableMessagePopup = () => {
        this.setState({
            popupProps: {
                ...this.state.popupProps,
                hidden: true,
            },
            toggleCoordinates: false,
        });
    }

    /**
     * Assigns game values to corresponding cells.
     */
    private assignValues = (values: number[], isInitialValues = true) => {
        const cellProps: TableCellsMap = {};
        values.forEach((value, key) => {
            const isReadOnlyCell =
                (isInitialValues && value !== 0)
                || (
                    !isInitialValues
                    && this.state.cellProps[key]
                    && this.state.cellProps[key].mode === CellMode.ReadOnly
                )
            ;

            cellProps[key] = {
                value,
                withHighlight: false,
                withError: false,
                mode: isReadOnlyCell ? CellMode.ReadOnly : CellMode.Pencil,
                onFocus: isInitialValues ? this.onSelect : () => {},
                onClick: isInitialValues ? this.onSelect : () => {},
                onKeyup: isInitialValues ? this.onKeyup : () => {},
                onInput: isInitialValues && value === 0 ? this.onInput : () => {},
            };
        });
 
        this.setState({
            cellProps,
            cellMode: CellMode.Pencil,
            popupProps: {
                ...this.state.popupProps,
                hidden: true,
            },
            toggleCoordinates: false,
        });
    }

    private handleCellModeChange = () => {
        const cellProps: TableCellsMap = {};

        for (const key in this.state.cellProps) {
            let mode = this.state.cellProps[key].mode;
            if (!this.state.cellProps[key].value) {
                mode = this.state.cellMode === CellMode.Pencil ? CellMode.Notes : CellMode.Pencil;
            }

            cellProps[key] = {
                ...this.state.cellProps[key],
                mode,
            };
        }

        this.setState({ cellProps });
    }

    private enableResetPopup = () => {
        this.enableMessagePopup({
            text: <span>Are you sure you want to reset?</span>,
            buttons: [
                {
                    size: GameButtonSize.Small,
                    value: "Yes",
                    onClick: () => this.assignValues(this.props.game.mask),
                },
                {
                    size: GameButtonSize.Small,
                    value: "No",
                    onClick: this.disableMessagePopup,
                },
            ],
        });
    }

    private enableSolvePopup = () => {
        this.enableMessagePopup({
            text: <span>Are you sure you want to solve?</span>,
            buttons: [
                {
                    size: GameButtonSize.Small,
                    value: "Yes",
                    onClick: () => this.assignValues(this.props.game.matrix, false),
                },
                {
                    size: GameButtonSize.Small,
                    value: "No",
                    onClick: this.disableMessagePopup,
                },
            ],
        });
    }

    /**
     * shows cell errors and checks if game is solved
     */
    private checkForWin = (cellProps: TableCellsMap, showError = false) => {
        // shows in-game error for same values
        const result = showDuplicates(
            cellProps,
            this.props.game.gameType,
            this.props.game.ratio,
        );

        let hasInvalidCells = false;
        for (const key in result.cellProps) {
            if (result.cellProps[key].mode === CellMode.Notes || !result.cellProps[key].value) {
                hasInvalidCells = true;
                break;
            }
        }

        // displays win message if conditions are met
        if (result.duplicates.length === 0 && !hasInvalidCells) {
            this.enableMessagePopup({
                text: (
                    <React.Fragment>
                        <span>Correct!</span><br /><span>You have won the game!</span>
                    </React.Fragment>
                ),
                buttons: [{
                    size: GameButtonSize.Small,
                    icon: checkSvg,
                    onClick: this.disableMessagePopup,
                }],
            });

            for (const key in result.cellProps) {
                result.cellProps[key] = {
                    ...result.cellProps[key],
                    onFocus: () => {},
                    onClick: () => {},
                    onKeyup: () => {},
                    onInput: () => {},
                };
            }
        }
        else if (showError) {
            const wrongCells = result.duplicates
                .map(pos => {
                    const row = Math.floor(pos / this.props.game.gameType) + 1;
                    const col = "ABCDEFGHI"[pos - (row - 1) * this.props.game.gameType];
                    return `${row + col}`;
                })
                .sort()
                .join(", ")
            ;

            this.enableMessagePopup(
                {
                    text: wrongCells.length > 0
                        ? <span>Cells {wrongCells} are incorrect.</span>
                        : <span>Correct so far!</span>,
                    buttons: [{
                        size: GameButtonSize.Small,
                        icon: checkSvg,
                        onClick: this.disableMessagePopup,
                    }],
                },
                wrongCells.length > 0,
            );
        }

        return result.cellProps;
    }

    private onSelect = (e: React.FocusEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLTextAreaElement>) => {
        const cell = e.target as HTMLTextAreaElement;
        const { x, y } = findCoordinates(this.props.game.ratio, cell);
        const pos = x * this.props.game.gameType + y;
        const props = this.state.cellProps[pos];

        // Selects clicked value. Gets triggered on cell focus
        if (
            (this.state.cellMode === CellMode.Notes && props.mode === CellMode.Pencil)
            || (this.state.cellMode === CellMode.Pencil && props.mode !== CellMode.ReadOnly)
        ) {
            cell.select();
        }

        // Updates hightlight prop in all cells
        this.setState({ cellProps: highlight(this.state.cellProps, props) });
    }

    private onKeyup = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const cell = e.target as HTMLTextAreaElement;
        const coor = findCoordinates(this.props.game.ratio, cell);
        const pos = coor.x * this.props.game.gameType + coor.y;
        const props = this.state.cellProps[pos];

        // removes notes from column, row and grid where the pencil value was inserted
        const cellProps = updateNotesCells(
            this.state.cellMode,
            this.props.game.gameType,
            this.props.game.ratio,
            this.state.cellProps,
            props,
            coor,
        );

        // shows cell errors and checks if game is solved
        const cellPropsWithErrors = this.checkForWin(cellProps || this.state.cellProps);

        // use arrow keys to move from cell to cell
        arrowKeys(e.keyCode, coor);

        this.setState({ cellProps: cellPropsWithErrors });
    }

    private onInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const cell = e.target as HTMLTextAreaElement;
        const { x, y } = findCoordinates(this.props.game.ratio, cell);
        const pos = x * this.props.game.gameType + y;
        const props = this.state.cellProps[pos];

        // Filters invalid inputs or updates props from new input value
        if (cell.value === "" || cell.value.match(/^[1-9]+$/g)) {
            let value: number;

            if (this.state.cellMode === CellMode.Pencil) {
                value = parseInt(cell.value) || 0;
            }
            else {
                const notes = cell.value
                    .split("")
                    .map(val => parseInt(val))
                    .sort()
                ;
                value = parseInt(removeDuplicates(notes).join("")) || 0;
            }

            const cellProps = {
                ...this.state.cellProps,
                [pos]: {
                    ...props,
                    value,
                    mode: this.state.cellMode,
                },
            };

            this.setState({ cellProps });
        }
    }
}
