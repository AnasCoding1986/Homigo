import PropTypes from "prop-types";
import Button from "../Shared/Button/Button";
import { useState } from "react";
import { DateRange } from "react-date-range";
import { differenceInCalendarDays, parseISO } from "date-fns";

const RoomReservation = ({ room }) => {
  const [state, setState] = useState([
    {
      startDate: room?.from ? parseISO(room.from) : new Date(),
      endDate: room?.to ? parseISO(room.to) : null,
      key: "selection",
    },
  ]);

  const startDate = state[0].startDate;
  const endDate = state[0].endDate;

  // Allowed booking range
  const minDate = room?.from ? parseISO(room.from) : new Date();
  const maxDate = room?.to ? parseISO(room.to) : undefined;

  // Calculate number of nights (minimum 1 night)
  const nights =
    startDate && endDate
      ? Math.max(1, differenceInCalendarDays(endDate, startDate))
      : 0;

  // Total price calculation
  const totalPrice = nights * room?.price;

  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {room?.price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>

      <hr />

      <div className="flex justify-center">
        <DateRange
          showDateDisplay={false}
          rangeColors={["#F6657E"]}
          editableDateInputs={true}
          onChange={(item) => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>

      <hr />

      <div className="p-4">
        <Button label={"Reserve"} />
      </div>

      <hr />

      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <div>Total ({nights} night{nights > 1 ? "s" : ""})</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  );
};

RoomReservation.propTypes = {
  room: PropTypes.object,
};

export default RoomReservation;
