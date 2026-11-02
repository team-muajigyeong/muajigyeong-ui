"use client";

import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import classNames from "classnames/bind";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import useFocusTrap from "../internal/use-focus-trap.js";
import styles from "./style.module.css";

const cx = classNames.bind(styles);
const dateFormatter = new Intl.DateTimeFormat("ko", { year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" });
const monthFormatter = new Intl.DateTimeFormat("ko", { year: "numeric", month: "long" });
const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

/** 양 끝 날짜를 포함하는 선택 범위. null은 해당 날짜가 선택되지 않았음을 뜻합니다. */
export type DateRange = [Dayjs | null, Dayjs | null];
/** 날짜 선택 대화상자. 열기 상태를 제어하려면 modalController를 전달하세요. */
export type DatePickerProps = {
  /** 선택 가능한 가장 이른 날짜. 기본값은 1900-01-01입니다. */
  minimumDate?: Dayjs;
  /** 선택 가능한 가장 늦은 날짜. 기본값은 오늘입니다. 미래 여행 날짜를 선택하려면 명시하세요. */
  maximumDate?: Dayjs;
  /** useDatePickerSelection이 반환한 선택 상태. 생략하면 내부에서 관리합니다. */
  dateHandler?: ReturnType<typeof useDatePickerSelection>;
  /** 부모에서 제어하는 열림 상태와 상태 변경 함수. */
  modalController?: [boolean, (value: boolean) => void];
  /** 하루 또는 양 끝 날짜를 포함한 기간 선택. 기본값은 date입니다. */
  mode?: "range" | "date";
  /** 기간 달력을 열 때 수정할 날짜. 시작일이 없으면 먼저 시작일을 선택합니다. 생략하면 자동으로 정합니다. */
  initialRangeBoundary?: "start" | "end";
  /** 대화상자 제목. 기본값은 날짜 선택입니다. */
  title?: string;
  /** 사용하는 화면의 제목 구조에 맞춘 단계. 기본값은 2입니다. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 열기 버튼이 교체될 때 사용할 초점 복귀 요소. 생략하면 열기 직전 요소로 돌아갑니다. */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

/** DatePicker의 선택 시작일과 종료일을 관리합니다. 초기값 변경은 setSelection으로 반영하세요. */
export const useDatePickerSelection = ([start, end]: DateRange) => {
  const [selection, setSelection] = useState<DateRange>([start, end]);
  return {
    selection, setSelection,
    startDate: selection[0],
    setStartDate(value: Dayjs | null) { setSelection(previous => [value, previous[1]]); },
    endDate: selection[1],
    setEndDate(value: Dayjs | null) { setSelection(previous => [previous[0], value]); },
  };
};

/** 브라우저 기본 대화상자에서 날짜를 선택합니다. 선택은 즉시 반영되며 닫기는 선택을 취소하지 않습니다. */
function DatePicker({
  minimumDate = dayjs("1900-01-01"), maximumDate = dayjs(), mode = "date",
  modalController, dateHandler, title = "날짜 선택", headingLevel = 2, returnFocusRef, initialRangeBoundary,
}: DatePickerProps) {
  const internalSelection = useDatePickerSelection([dayjs(), dayjs()]);
  const { startDate, endDate, setSelection } = dateHandler ?? internalSelection;
  const internalController = useState(false);
  const [opened, setOpen] = modalController ?? internalController;
  const [activeDate, setActiveDate] = useState(() => startDate ?? dayjs());
  const [selectionType, setSelectionType] = useState<"startDate" | "endDate" | null>(
    startDate && endDate ? null : startDate ? "endDate" : "startDate",
  );
  const dlgRef = useRef<HTMLDialogElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<string | null>(null);
  const titleId = useId();
  const monthId = useId();
  const helpId = useId();
  const Heading = `h${headingLevel}` as const;
  const startKey = startDate?.format("YYYY-MM-DD") ?? "";
  const endKey = endDate?.format("YYYY-MM-DD") ?? "";
  const minKey = minimumDate.format("YYYY-MM-DD");
  const maxKey = maximumDate.format("YYYY-MM-DD");
  const activeKey = activeDate.format("YYYY-MM-DD");

  useEffect(() => {
    const dialog = dlgRef.current;
    if (!dialog) return;
    if (opened && !dialog.open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      // Reopen on the current selection, including a value changed by the consuming form.
      const boundary = mode === "range" ? initialRangeBoundary : undefined;
      const initialKey = boundary === "end" ? endKey || startKey : startKey || endKey;
      let initial = dayjs(initialKey || undefined).startOf("day");
      if (!initial.isValid()) initial = dayjs().startOf("day");
      if (initial.isBefore(dayjs(minKey), "day")) initial = dayjs(minKey);
      if (initial.isAfter(dayjs(maxKey), "day")) initial = dayjs(maxKey);
      pendingFocus.current = initial.format("YYYY-MM-DD");
      setActiveDate(initial);
      setSelectionType(boundary === "start" ? "startDate" : boundary === "end" ? (startKey ? "endDate" : "startDate") : startKey && endKey ? null : startKey ? "endDate" : "startDate");
      dialog.showModal();
    }
    if (!opened && dialog.open) dialog.close();
  }, [opened, startKey, endKey, minKey, maxKey, mode, initialRangeBoundary]);

  // Reuse the same Tab containment as the other public dialogs. Native close releases inert first.
  useFocusTrap({ containerRef: dlgRef, initialFocusRef: activeButtonRef, active: opened, restoreFocus: false });
  useEffect(() => {
    if (opened && pendingFocus.current === activeKey) {
      activeButtonRef.current?.focus();
      pendingFocus.current = null;
    }
  }, [opened, activeKey]);

  function moveTo(date: Dayjs, focus = true) {
    pendingFocus.current = focus ? date.format("YYYY-MM-DD") : null;
    setActiveDate(date.startOf("day"));
    // An endpoint card can target the date already in view, without causing another render.
    if (focus && date.isSame(activeDate, "day")) {
      activeButtonRef.current?.focus();
      pendingFocus.current = null;
    }
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, date: Dayjs) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next: Dayjs;
    switch (event.key) {
      case "ArrowLeft": next = date.subtract(1, "day"); break;
      case "ArrowRight": next = date.add(1, "day"); break;
      case "ArrowUp": next = date.subtract(7, "day"); break;
      case "ArrowDown": next = date.add(7, "day"); break;
      case "Home": next = date.subtract(date.day(), "day"); break;
      case "End": next = date.add(6 - date.day(), "day"); break;
      case "PageUp": next = date.subtract(1, event.shiftKey ? "year" : "month"); break;
      case "PageDown": next = date.add(1, event.shiftKey ? "year" : "month"); break;
      default: return;
    }
    event.preventDefault();
    event.stopPropagation();
    moveTo(next);
  }

  function selectDate(date: Dayjs) {
    if (date.isBefore(minimumDate, "day") || date.isAfter(maximumDate, "day")) return;
    moveTo(date);
    if (mode === "date") {
      setSelection(date.isSame(startDate, "day") ? [null, null] : [date, date]);
      return;
    }
    if (selectionType === "startDate" || selectionType === null) {
      const retainedEnd = selectionType === "startDate" && endDate && !date.isAfter(endDate, "day") ? endDate : null;
      setSelection([date, retainedEnd]);
      setSelectionType(retainedEnd ? null : "endDate");
    } else if (!startDate || date.isBefore(startDate, "day")) {
      setSelection([date, null]);
      setSelectionType("endDate");
    } else {
      setSelection([startDate, date]);
      setSelectionType(null);
    }
  }

  const first = activeDate.startOf("month");
  const gridStart = first.subtract(first.day(), "day");
  const weekCount = Math.ceil((first.day() + first.daysInMonth()) / 7);
  const inRange = (date: Dayjs) => mode === "range" && Boolean(startDate && endDate && !date.isBefore(startDate, "day") && !date.isAfter(endDate, "day"));

  return (
    <dialog ref={dlgRef} className={styles.calendarDlg} aria-labelledby={titleId}
      onCancel={event => { if (event.target !== event.currentTarget) return; event.preventDefault(); setOpen(false); }}
      onClose={event => {
        if (event.target !== event.currentTarget || event.currentTarget.open) return;
        setOpen(false);
        for (const target of [returnFocusRef?.current, previousFocusRef.current]) {
          if (!target?.isConnected || target.matches(":disabled") || target.closest('[hidden], [inert], [aria-hidden="true"], dialog:not([open])')
            || target.getClientRects().length === 0 || getComputedStyle(target).visibility === "hidden") continue;
          target.focus();
          if (document.activeElement === target) break;
        }
        previousFocusRef.current = null;
      }}>
      <Heading id={titleId} className={styles.calendarDlgHeader}>{title}</Heading>
      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <div className={styles.calendarPagination}>
            <div id={monthId} className={styles.calendarTitle} aria-live="polite" aria-atomic="true">{monthFormatter.format(activeDate.toDate())}</div>
            <button type="button" className={styles.pageFlipper} aria-label="이전 달" onClick={() => moveTo(activeDate.subtract(1, "month"), false)}><FaChevronLeft aria-hidden="true" /></button>
            <button type="button" className={styles.pageFlipper} aria-label="다음 달" onClick={() => moveTo(activeDate.add(1, "month"), false)}><FaChevronRight aria-hidden="true" /></button>
          </div>
          {mode === "range" && <div className={styles.rangeSelectorWrap}>
            <button type="button" className={styles.rangeSelector} aria-pressed={selectionType === "startDate"}
              onClick={() => { setSelectionType("startDate"); moveTo(startDate ?? activeDate); }}>
              시작 날짜:<span className={styles.dateValue}>{startDate ? dateFormatter.format(startDate.toDate()) : "선택 안 됨"}</span>
            </button>
            <button type="button" className={styles.rangeSelector} aria-pressed={selectionType === "endDate"}
              onClick={() => { setSelectionType("endDate"); moveTo(endDate ?? activeDate); }}>
              종료 날짜:<span className={styles.dateValue}>{endDate ? dateFormatter.format(endDate.toDate()) : "선택 안 됨"}</span>
            </button>
          </div>}
        </div>
        {mode === "range" && <p className={styles.selectionHint} role="status">
          {selectionType === "startDate" ? "시작 날짜를 선택하세요" : selectionType === "endDate" ? "종료 날짜를 선택하세요" : "날짜를 선택하면 새 범위를 시작합니다. 수정하려면 위의 날짜를 누르세요"}
        </p>}
        <div className={styles.dateGrid} role="grid" aria-labelledby={monthId} aria-describedby={helpId} aria-multiselectable={mode === "range" || undefined}>
          <div className={cx("row", "headers")} role="row">
            {weekdays.map(day => <div key={day} className={styles.dateCell} role="columnheader" aria-label={`${day}요일`}>{day}</div>)}
          </div>
          {Array.from({ length: weekCount }, (_, week) => <div key={week} className={styles.row} role="row">
            {Array.from({ length: 7 }, (_, column) => {
              const date = gridStart.add(week * 7 + column, "day");
              const key = date.format("YYYY-MM-DD");
              const disabled = date.isBefore(minimumDate, "day") || date.isAfter(maximumDate, "day");
              const endpoint = date.isSame(startDate, "day") || date.isSame(endDate, "day");
              const selected = inRange(date);
              const left = column > 0 && inRange(date.subtract(1, "day"));
              const right = column < 6 && inRange(date.add(1, "day"));
              const above = week > 0 && inRange(date.subtract(7, "day"));
              const below = week < weekCount - 1 && inRange(date.add(7, "day"));
              return <div key={key} role="gridcell" aria-colindex={column + 1} aria-selected={endpoint || selected}
                className={cx("dateCell", { inRange: selected, roundTopLeft: selected && !left && !above, roundTopRight: selected && !right && !above,
                  roundBottomLeft: selected && !left && !below, roundBottomRight: selected && !right && !below })}>
                <button type="button" data-date={key} ref={key === activeKey ? activeButtonRef : undefined} tabIndex={key === activeKey ? 0 : -1}
                  aria-label={dateFormatter.format(date.toDate())} aria-disabled={disabled} aria-current={date.isSame(dayjs(), "day") ? "date" : undefined}
                  className={cx({ outDate: !date.isSame(activeDate, "month") || disabled, startDate: date.isSame(startDate, "day"), endDate: date.isSame(endDate, "day") })}
                  onKeyDown={event => moveWithKeyboard(event, date)} onClick={() => selectDate(date)}>
                  <span className={cx("date", { selected: endpoint })}>{date.date()}</span>
                </button>
              </div>;
            })}
          </div>)}
        </div>
        <p id={helpId} className={styles.keyboardHelp}>방향키로 날짜를 이동하고 Enter 또는 Space로 선택하세요. Home·End는 주의 처음·끝, Page Up·Down은 월, Shift와 함께 누르면 연도를 이동합니다. Escape로 닫습니다.</p>
      </div>
      <button type="button" className={styles.btnDlgClose} aria-label={`${title} 닫기`} onClick={() => setOpen(false)}><FaX aria-hidden="true" /></button>
    </dialog>
  );
}

export default DatePicker;
