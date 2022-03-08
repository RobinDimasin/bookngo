import { FC, useEffect, useState } from "react";

const DotLoading: FC<{ length?: number }> = ({ length = 3 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000 / (length + 1)));
      setCount((count + 1) % (length + 1));
    })();
  }, [count, length]);

  return <>{new Array(count).fill(".").join("")}</>;
};
export default DotLoading;
