import { getChartType, registerReportsPanel } from "data/reports-registry";
import Grid from "@material-ui/core/Grid";
import { Box } from "@material-ui/core";
import { LineChart } from "components/layout/pages/reporting/charts/line-chart";
import { QuickStat } from "components/layout/pages/reporting/charts/quick-stat";
import { DonutChart } from "components/layout/pages/reporting/charts/donut-chart";
import { ReportTable } from "components/layout/pages/reporting/charts/report-table";
import ContactMailIcon from "@material-ui/icons/ContactMail";

registerReportsPanel("contacts", {
  name: "Contacts",
  reports: [
    "total_new_contacts",
    "chart_new_contacts",
    "chart_contacts_by_optin_status",
      "table_list_engagement"
  ],
  layout: ({ reports, isLoading }) => {
    const {
      total_new_contacts,
      chart_new_contacts,
      chart_contacts_by_optin_status,
      table_list_engagement
    } = reports;

    return (
      <Box flexGrow={1}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <QuickStat
              title={"Total New Contacts"}
              i
              id={"total_new_contacts"}
              data={!isLoading ? total_new_contacts : {}}
              loading={isLoading}
              icon={<ContactMailIcon />}
            />
          </Grid>
          <Grid item xs={12}>
            <LineChart
              title={"New Contacts"}
              id={"chart_new_contacts"}
              data={!isLoading ? chart_new_contacts : {}}
              loading={isLoading}
            />
          </Grid>

          <Grid item xs={12}>
            <DonutChart
              title={"Opt-in Status"}
              id={"chart_contacts_by_optin_status"}
              data={!isLoading ? chart_contacts_by_optin_status : {}}
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <ReportTable
              title={"Engagement"}
              id={"table_list_engagement"}
              data={!isLoading ? table_list_engagement : {}}
              loading={isLoading}
            />
          </Grid>
        </Grid>
      </Box>
    );
  },
});
