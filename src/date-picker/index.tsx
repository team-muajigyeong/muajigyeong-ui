"use client";

import dayjs, { type Dayjs } from "dayjs"
import { useEffect, useId, useRef, useState } from "react";
import styles from "./style.module.css"
import classNames from "classnames/bind";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const cx = classNames.bind(styles);

/** Inclusive selection endpoints; null represents an unselected endpoint. */
export type DateRange = [Dayjs|null,Dayjs|null];
/** Date selection dialog. Pass modalController to provide an opening control. */
export type DatePickerProps = {
  /** Earliest selectable day; defaults to 1900-01-01. */
  minimumDate?: Dayjs;
  /** Latest selectable day; defaults to today. */
  maximumDate?: Dayjs;
  /** Selection state returned by useDatePickerSelection; otherwise managed internally. */
  dateHandler?: ReturnType<typeof useDatePickerSelection>;
  /** Controlled open state and setter. */
  modalController?: [boolean, (value: boolean) => void];
  /** Single-day or inclusive range selection. Defaults to date. */
  mode?: "range" | "date";
}

/** Manage the selected endpoints for a DatePicker instance. */
export const useDatePickerSelection = (
  [start,end]:[Dayjs|null, Dayjs|null]
)=>{
  const [selection,setSelection] = useState<DateRange>([start, end]);

  const methodsAndproperties = {
    selection,setSelection,
    get startDate(){ return selection[0]; },
    setStartDate(value:Dayjs|null):void {
      setSelection((prv)=>{
        const copy = [...prv];
        copy[0] = value;
        return copy as DateRange;
      });
    },

    get endDate() { return selection[1]; },
    setEndDate(value:Dayjs|null):void {
      setSelection((prv)=>{
        const copy = [...prv];
        copy[1] = value;
        return copy as DateRange;
      });
    },

  }

  return {
    ...methodsAndproperties
  };
}

/** Select a date or date range using the existing native-dialog calendar UI. */
function DatePicker({
    minimumDate = dayjs("1900-01-01"),
    maximumDate = dayjs(),
    mode = "date",
    modalController,
    dateHandler
  }:DatePickerProps) {
  const internalSelection = useDatePickerSelection([dayjs(),dayjs()]);
  const {endDate,setSelection,startDate} = dateHandler ?? internalSelection;
  const [visibleDate,setVisibleDate] = useState<Dayjs>(()=>{
    return startDate?.clone().set("date",1) ?? dayjs();
  });
  const firstDay = () => visibleDate.startOf("month");
  const dateLength = () => visibleDate.daysInMonth();
  const firstWeekDay = ()=>firstDay().day();
  const lastDay = () => visibleDate.endOf("month").startOf("day");
  const lastWeekday = ()=>lastDay().day();
  const dlgRef = useRef<HTMLDialogElement>(null);
  const internalController = useState<boolean>(false);
  const [opened, setOpen] = modalController ?? internalController;
  const titleId = useId();
  const [isMounted,setMount] = useState<boolean>(false);
  const [selectionType,setSelectionType] = useState<"startDate"|"endDate"|null>(
    startDate && endDate ? null : startDate ? "endDate" : "startDate"
  );
  const [selectedWeeks, setSelectedWeeks] = useState<Set<number>>(new Set());

  useEffect(()=>{ if(!isMounted) { setMount(true); } });
  useEffect(()=>{
    const dlg = dlgRef.current;
    if(!dlg) return;
    if (opened && !dlg.open) dlg.showModal();
    if (!opened && dlg.open) dlg.close();
  }, [opened]);

  const selectDate = (date:Dayjs):void =>{
    if(mode === "date") {
      if(!date.isSame(startDate, "day")) {
        setSelection([date,date]);
      } else {
        setSelection([null,null]);
      }
      return;
    }

    const selectedDate = date.startOf("day");
    if (selectionType === "startDate" || selectionType === null) {
      // A completed range starts over unless a card explicitly requests an edit.
      const retainedEnd = selectionType === "startDate" && endDate &&
        !selectedDate.isAfter(endDate, "day") ? endDate : null;
      setSelection([selectedDate, retainedEnd]);
      setSelectionType(retainedEnd ? null : "endDate");
    } else if (!startDate || selectedDate.isBefore(startDate, "day")) {
      setSelection([selectedDate, null]);
      setSelectionType("endDate");
    } else {
      setSelection([startDate, selectedDate]);
      setSelectionType(null);
    }
  }

  const dateFormatter = (value:Dayjs):string => {
    return Intl.DateTimeFormat("ko",{
      year:"numeric",
      month:"2-digit",
      day:"2-digit",
      weekday:"short",
    }).format(value.toDate())
  }

  return (
    <dialog className={styles.calendarDlg} ref={dlgRef} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); setOpen(false); }}
    onClose={e=>{
      setOpen(false)
    }}>
      <h1 id={titleId} className={cx("calendarDlgHeader")}>날짜 선택</h1>
      <div className={styles.calendar}>
        <div className={styles.calendarHeader}>
          <div className={styles.calendarPagination}>
            <div className={styles.calendarTitle}>
              {Intl.DateTimeFormat("ko",{year:"numeric", month:"narrow"}).format(visibleDate.toDate())}
            </div>
            <button className={styles.pageFlipper} aria-label="이전 달" onClick={e=>{
              setVisibleDate((prev)=>{
                return prev.clone().subtract(1,"month")
              })
              }}><FaChevronLeft /></button>
            <button className={styles.pageFlipper} aria-label="다음 달" onClick={e=>{
              setVisibleDate((prev)=>{
                return prev.clone().add(1,"month")
              })
            }}>
            <FaChevronRight />
            </button>
          </div>

          {mode === "range" && (
            <div className={styles.rangeSelectorWrap}>
              <button type="button" className={styles.rangeSelector}
                aria-pressed={selectionType === "startDate"}
                onClick={() => setSelectionType("startDate")}>
                시작 날짜:
                <span className={styles.dateValue}>{startDate ? dateFormatter(startDate) : "선택 안 됨"}</span>
              </button>
              <button type="button" className={styles.rangeSelector}
                aria-pressed={selectionType === "endDate"}
                onClick={() => setSelectionType("endDate")}>
                종료 날짜:
                <span className={styles.dateValue}>{endDate ? dateFormatter(endDate) : "선택 안 됨"}</span>
              </button>
            </div>
          )}
        </div>
        {mode === "range" && (
          <p className={styles.selectionHint} role="status">
            {selectionType === "startDate" ? "시작 날짜를 선택하세요" :
              selectionType === "endDate" ? "종료 날짜를 선택하세요" :
              "날짜를 선택하면 새 범위를 시작합니다. 수정하려면 위의 날짜를 누르세요"}
          </p>
        )}
        <div className={styles.dateGrid} role="grid">
          <div className={cx("row","headers")} role="row">
            <div className={cx("dateCell")} role="columnheader">일</div>
            <div className={cx("dateCell")} role="columnheader">월</div>
            <div className={cx("dateCell")} role="columnheader">화</div>
            <div className={cx("dateCell")} role="columnheader">수</div>
            <div className={cx("dateCell")} role="columnheader">목</div>
            <div className={cx("dateCell")} role="columnheader">금</div>
            <div className={cx("dateCell")} role="columnheader">토</div>
          </div>
          {
            [
              Array.from({length:firstWeekDay()}).map((_,i,arr)=>{
                const prev = firstDay().subtract(arr.length+1,"day");
                return prev.add(i+1,"day")
              }),
              Array.from({length:dateLength()}).map((_,i)=>{
                return firstDay().set("date",i+1)
              }),
              Array.from({length:6-lastWeekday()}).map((_,i)=>{
                return lastDay().add(i+1,"day")
              })
            ].flat()
            .reduce((acc:{week:number,days:Dayjs[]}[],curr,index,days)=>{
              const currentRow = Math.ceil((index+1)/7)-1;
              if (!acc[currentRow]) {
                acc[currentRow] = {
                  days:[],
                  week:0
                };
              }

              acc[currentRow].days.push(curr);
              acc[currentRow].week = Math.ceil(curr.day()/7)
              return acc;
            },[]).map(({week,days}, index,arr)=>{
              return <div role="row"
              className={cx("row")}
              key={index}>
              {days.map((date,index,arr)=>{
                const isOutDate = date.month() != visibleDate.month() || date.isAfter(maximumDate, "day") || date.isBefore(minimumDate, "day");
                const isSelected = date.isSame(startDate, "day") || date.isSame(endDate, "day");
                // Only exposed corners are rounded; adjacent weeks share their background.
                const isRangeDate = (value: Dayjs) => mode === "range" && Boolean(
                  startDate && endDate &&
                  !value.isBefore(startDate, "day") && !value.isAfter(endDate, "day")
                );
                const isInRange = isRangeDate(date);
                const hasLeft = date.day() > 0 && isRangeDate(date.subtract(1, "day"));
                const hasRight = date.day() < 6 && isRangeDate(date.add(1, "day"));
                const hasAbove = days[0].isAfter(firstDay().startOf("week"), "day") &&
                  isRangeDate(date.subtract(7, "day"));
                const hasBelow = days[0].isBefore(lastDay().startOf("week"), "day") &&
                  isRangeDate(date.add(7, "day"));

                return <div
                  role="gridcell"
                  aria-colindex={date.day()+1}
                  key={date.toString()}
                  aria-selected={isSelected}
                  className={cx("dateCell",{
                    inRange:isInRange,
                    roundTopLeft:isInRange && !hasLeft && !hasAbove,
                    roundTopRight:isInRange && !hasRight && !hasAbove,
                    roundBottomLeft:isInRange && !hasLeft && !hasBelow,
                    roundBottomRight:isInRange && !hasRight && !hasBelow,
                  })}>
                  <button
                    aria-label={Intl.DateTimeFormat("ko",{day:"2-digit", weekday:"short", month:"2-digit"}).format(date.toDate())}
                    aria-disabled={date.isAfter(maximumDate, "day") || date.isBefore(minimumDate, "day")}
                    className={cx({
                      outDate:isOutDate,
                      startDate:date.isSame(startDate, "day"),
                      endDate:date.isSame(endDate, "day"),
                    })}
                    onClick={_=>{
                      if (date.isAfter(maximumDate, "day") || date.isBefore(minimumDate, "day")) return false;
                      setVisibleDate(date);
                      if ( days.find(date=>date.isSame(startDate, "day") || date.isSame(endDate, "day")) ) {
                        setSelectedWeeks((prv)=>{
                          const copy = new Set(prv);
                          copy.add(index);
                          return copy;
                        });
                      }
                      selectDate(date);
                    }}
                  >
                    <div className={cx("date",{
                        selected: date.isSame(startDate, "day") || date.isSame(endDate, "day")
                    })}>{date.date()}
                    </div>
                  </button>
                </div>
                })}
              </div>
            })
          }
        </div>
      </div>
      <button type="button" className={cx("btnDlgClose")} aria-label="날짜 선택 닫기" onClick={() => setOpen(false)}>
        <FaX />
      </button>
    </dialog>
  );
}

export default DatePicker;
