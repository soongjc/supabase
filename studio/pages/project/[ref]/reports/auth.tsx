import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'

import { NextPageWithLayout } from 'types'
import { Presets } from 'components/interfaces/Reports/Reports.types'
import ReportsLayout from 'components/layouts/ReportsLayout/ReportsLayout'
import { hooksFactory, usePresetReport } from 'components/interfaces/Reports/Reports.utils'
import { PRESET_CONFIG } from 'components/interfaces/Reports/Reports.constants'
import ReportWidget from 'components/interfaces/Reports/ReportWidget'
import {
  renderDailyActiveUsers,
  renderNewUsers,
} from 'components/interfaces/Reports/renderers/AuthRenderers'

export const ApiBotsPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { ref } = router.query
  const config = PRESET_CONFIG[Presets.AUTH]
  const hooks = hooksFactory(ref as string, config)
  const [dailyActiveUsers, dailyActiveUsersHandlers] = hooks.dailyActiveUsers()
  const [newUsers, newUsersHandlers] = hooks.newUsers()
  const { isLoading, Layout } = usePresetReport(
    [dailyActiveUsers, newUsers],
    [dailyActiveUsersHandlers, newUsersHandlers]
  )
  return (
    <Layout title={config.title}>
      <div className="grid  lg:grid-cols-4">
        <ReportWidget
          isLoading={isLoading}
          params={dailyActiveUsers.params}
          className="col-span-4 col-start-1"
          title="Daily Active Users"
          description="The daily count of active authenticated users"
          data={dailyActiveUsers.logData}
          renderer={renderDailyActiveUsers}
        />
        <ReportWidget
          isLoading={isLoading}
          params={newUsers.params}
          className="col-span-4 col-start-1"
          title="Daily New Users"
          description="The daily count of new user signups"
          data={newUsers.logData}
          renderer={renderNewUsers}
        />
      </div>
    </Layout>
  )
}

ApiBotsPage.getLayout = (page) => <ReportsLayout>{page}</ReportsLayout>

export default observer(ApiBotsPage)
