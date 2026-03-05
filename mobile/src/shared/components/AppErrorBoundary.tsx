import ErrorFallback from "./ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
    children: React.ReactNode;
};

export default function AppErrorBoundary({ children }: Props) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                console.error("App crashed:", error, info);
            }}
            resetKeys={[location.pathname]}
        >
            {children}
        </ErrorBoundary>
    );
}
