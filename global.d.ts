import 'framer-motion';

declare module 'framer-motion' {
    interface MotionProps extends React.HTMLAttributes<HTMLElement> { }
}