import { DOMElement } from "solid-js/jsx-runtime";

export type MouseEventDOMTableRow = MouseEvent & {
  currentTarget: HTMLTableRowElement;
  target: DOMElement;
}

export type MouseEventDOMTextArea = MouseEvent & {
  currentTarget: HTMLTextAreaElement;
  target: DOMElement;
}

export type MouseEventDOMDiv = MouseEvent & {
  currentTarget: HTMLDivElement;
  target: DOMElement;
}

export type InputEventDOMInput = InputEvent & {
  currentTarget:HTMLInputElement
  target:DOMElement
}

export type InputEventHTMLInput = InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
}


export type InputEventDOMDiv = InputEvent & {
  currentTarget:HTMLDivElement
  target:DOMElement
}

export type KeyboardEventDOMInput =
  KeyboardEvent & {
    currentTarget: HTMLInputElement;
    target: DOMElement;
  }