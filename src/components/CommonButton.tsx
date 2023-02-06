import type { ParentComponent, JSX } from 'solid-js';

const CommonButton: ParentComponent<JSX.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    class="inline-block min-w-10 mb-0 py-2 px-4 bg-transparent text-sColor text-xs text-center select-none border cursor-pointer touch-manipulation border-solid border-sBorder rounded-lg transition duration-400 ms-3 hover:border-sTheme hover:text-sTheme disabled:cursor-not-allowed disabled:text-sDisable disabled:border-sBorder disabled:bg-sDisableBg disabled:text-sDisable disabled:cursor-not-allowed disabled:hover:border-sBorder disabled:hover:bg-sDisableBg disabled:hover:text-sDisable"
    {...props}
  >
    {props.children}
  </button>
);

export default CommonButton;
