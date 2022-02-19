import { Grid } from "@material-ui/core";
import CommonStatistic from "./CommonStatistic";
import DetailStatistic from "./DetailStatistic";

export default function Statistics({
  trafficTime = 0,
  allocatedTime = 0,
  overTime = 0,
  type = "HOURS",
}) {
  const items = [
    { title: "TOTAL ALLOCATED", amount: allocatedTime },
    { title: "TOTAL AVAILABLE", amount: trafficTime - allocatedTime },
    { title: "TOTAL OVERTIME", amount: overTime },
  ];
  const totalAmount = trafficTime;
  return (
    <Grid container style={{ margin: "16px 0", padding: "0 52px" }}>
      <Grid item xs={3}>
        <CommonStatistic
          totalAmount={totalAmount}
          allocatedTime={allocatedTime}
          type={type}
        />
      </Grid>
      {items.map((item) => (
        <Grid item xs={3}>
          <DetailStatistic data={item} type={type} />
        </Grid>
      ))}
    </Grid>
  );
}
