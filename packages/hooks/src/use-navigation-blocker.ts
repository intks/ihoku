import { useEffect } from 'react';

export const useBlockOnBeforeUnload = (callback: (event: BeforeUnloadEvent) => any, condition: boolean) => {
  useEffect(() => {
    if (condition) {
      window.onbeforeunload = callback;
    }

    return () => {
      window.onbeforeunload = null;
    };
  }, [callback, condition]);
};

type Options = {
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
};

type UseNavigationBlockerProps = {
  shouldBlockRoute: boolean;
  onLeave?: () => void;
  options?: Options;
};

const useNavigationBlocker = (props: UseNavigationBlockerProps) => {
  const { shouldBlockRoute, options, onLeave } = props;

  // const blocker = useBlocker(shouldBlockRoute); implement react-router-dom useBlocker hook

  useBlockOnBeforeUnload(() => {
    return 'You have unsaved data.';
  }, shouldBlockRoute);

  //useEffect(() => {
   // if (blocker.state !== 'blocked') return;

   // if is blocked, implement show modal or other logic in here.
   // if passed, call the onLeave and blocker.proceed func
   // if cancel, call the blocker.reset func.

   // showModal({
     // title: options?.title,
    //  children: options?.description ,
     // actions: [
       // {
         // label: options?.submitText,
         // variant: 'outlined',
          //onClick: () => {
            // hideModal();
            // onLeave?.();
            // blocker.proceed?.();
         // },
        //},
        //{
         // label: options?.cancelText,
          //variant: 'contained',
          //onClick: () => {
            // hideModal();
            // blocker.reset?.();
         // },
        //},
      //],
    //});
  //}, [options, onLeave]);
};

export default useNavigationBlocker;
