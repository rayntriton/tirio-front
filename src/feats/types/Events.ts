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

export type KeyboardEventHTMLInput =
  KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }

export type KeyboardEventHTMLDiv =
  KeyboardEvent & { currentTarget: HTMLDivElement; target: Element; }

export type FocusEventHTMLInput = FocusEvent & {
  currentTarget: HTMLInputElement
  target: HTMLInputElement
}

export type FocusEventHTMLDiv = FocusEvent & { currentTarget: HTMLDivElement; target: Element; }

export type MouseEventHTMLButton = MouseEvent &
  { currentTarget: HTMLButtonElement; target: Element; }

export type MouseEventHTMLTableRow =  MouseEvent &
  { currentTarget: HTMLTableRowElement; target: Element; }

export type MouseEventHTMLTableCell = MouseEvent &
  { currentTarget: HTMLTableCellElement; target: Element; }

export type MouseEventHTMLDiv = MouseEvent &
  { currentTarget: HTMLDivElement; target: Element; }


export type EventHTMLSelect =  Event & { currentTarget: HTMLSelectElement; target: Element; }