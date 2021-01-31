import { getChartType, registerReportsPanel } from 'data/reports-registry'
import Grid from '@material-ui/core/Grid'
import { Box } from '@material-ui/core'
import { LineChart } from 'components/layout/pages/reporting/charts/line-chart'
import { QuickStat } from 'components/layout/pages/reporting/charts/quick-stat'
import ContactMailIcon from '@material-ui/icons/ContactMail';

registerReportsPanel('overview', {

  name: 'Overview',
  reports: [
    'total_new_contacts',
    'total_confirmed_contacts',
    'total_engaged_contacts',
    'total_unsubscribed_contacts',
    'chart_new_contacts',
    'total_emails_sent',
    'email_open_rate',
    'email_click_rate'
  ],
  layout: ({
    reports,
    isLoading
  }) => {

    const {
      total_new_contacts,
      total_confirmed_contacts,
      total_engaged_contacts,
      total_unsubscribed_contacts,
      chart_new_contacts,
      total_emails_sent,
      email_open_rate,
      email_click_rate
    } = reports

    return (
      <Box flexGrow={1}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <QuickStat
              title={'Total New Contacts'} i
              id={'total_new_contacts'}
              data={!isLoading ? total_new_contacts : {}}
              loading={isLoading}
              icon={<ContactMailIcon/>}
            />
          </Grid>
          <Grid item xs={3}>
            <QuickStat
              title={'Total Confirmed Contacts'} i
              id={'total_confirmed_contacts'}
              data={!isLoading ? total_confirmed_contacts : {}}
              loading={isLoading}
              icon={<ContactMailIcon/>}
            />
          </Grid>
          <Grid item xs={3}>
            <QuickStat
              title={'Total Engaged Contacts'}
              id={'total_engaged_contacts'}
              data={!isLoading ? total_engaged_contacts : {}}
              loading={isLoading}
              icon={<ContactMailIcon/>}
            />
          </Grid>
          <Grid item xs={3}>
            <QuickStat
              title={'Total New Contacts'}
              id={'total_unsubscribed_contacts'}
              data={!isLoading ? total_unsubscribed_contacts : {}}
              loading={isLoading}
              icon={<ContactMailIcon/>}
            />
          </Grid>
          <Grid item xs={12}>
            <LineChart
              title={'New Contacts'}
              id={'chart_new_contacts'}
              data={!isLoading ? chart_new_contacts : {}}
              loading={isLoading}
            />
          </Grid>
          <Grid item xs={4}>
            <QuickStat
              title={'Total Unsubscribed Contacts'}
              id={'total_emails_sent'}
              data={!isLoading ? total_emails_sent : {}}
              loading={isLoading}
              icon={<ContactMailIcon/>}
            />
          </Grid>
          <Grid item xs={4}>
            <QuickStat
              title={'Email Open Rate'}
              id={'email_open_rate'}
              data={!isLoading ? email_open_rate : {}}
              loading={isLoading}
              icon={<ContactMailIcon/>}
            />
          </Grid>
          <Grid item xs={4}>
            <QuickStat
              title={'Email Click Rate'}
              id={'email_click_rate'}
              data={!isLoading ? email_click_rate : {}}
              loading={isLoading}
              icon={<ContactMailIcon/>}
            />
          </Grid>
        </Grid>
      </Box>
    )
  }
})
