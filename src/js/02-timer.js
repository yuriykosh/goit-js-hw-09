import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { Notify } from 'notiflix';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  timer: document.querySelector('.timer'),
};

refs.startBtn.addEventListener('click', onStartBtnClick);
refs.startBtn.disabled = true;

let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0].getTime() - Date.now());
    const timeDifference = selectedDates[0].getTime() - Date.now();

    if (timeDifference <= 0) {
      Notify.failure('Please choose a date in the future');
      refs.startBtn.disabled = true;
      return;
    }
    Notify.success('Now press Start button');
    refs.startBtn.disabled = false;
  },
};

const datePicker = flatpickr('#datetime-picker', options);

function onStartBtnClick() {
  intervalId = setInterval(() => {
    const timeDifference = datePicker.selectedDates[0].getTime() - Date.now();
    if (timeDifference <= 1000) {
      clearInterval(intervalId);
      Notify.success('Timer stopped');
    }
    const countingTime = convertMs(timeDifference);
    renderTimer(countingTime);
    refs.startBtn.disabled = true;
  }, 1000);
}

function addLeadingZero(value) {
  return value.padStart(2, 0);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day).toString());
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour).toString());
  // Remaining minutes
  const minutes = addLeadingZero(
    Math.floor(((ms % day) % hour) / minute).toString()
  );
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second).toString()
  );

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

function renderTimer({ days, hours, minutes, seconds }) {
  refs.timer.innerHTML = `<div class="timer">
                            <div class="field">
                                <span class="value" data-days>${days}</span>
                                <span class="label">Days</span>
                            </div>
                            <div class="field">
                                <span class="value" data-hours>${hours}</span>
                                <span class="label">Hours</span>
                            </div>
                            <div class="field">
                                <span class="value" data-minutes>${minutes}</span>
                                <span class="label">Minutes</span>
                            </div>
                            <div class="field">
                                <span class="value" data-seconds>${seconds}</span>
                                <span class="label">Seconds</span>
                            </div>
                        </div>`;
}
