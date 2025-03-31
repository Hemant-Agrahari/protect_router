import FormsData from '@/types/formsData'
import dynamic from 'next/dynamic'
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })
type DonutUserDashboardProps = {
  series: FormsData
}

export default function DonutUserDashboard({
  series,
}: DonutUserDashboardProps) {
  const chartData = {
    series:
      series?.todayInvitaionBonus ||
      series?.todayBettingbonus ||
      series?.todayUpgradeBonus
        ? [
            series?.todayInvitaionBonus,
            series?.todayBettingbonus,
            series?.todayUpgradeBonus,
          ]
        : [100],
    options: {
      legend: {
        show: false,
        position: 'right',
        fontSize: '12px',
        display: 'flex',
        justify: 'center',

        labels: {
          colors: 'var(--white)',
        },
      },

      labels:
        series?.todayInvitaionBonus ||
        series?.todayBettingbonus ||
        series?.todayUpgradeBonus
          ? ['Invitation Bonus', 'Betting Commission', 'Achievement Bonus']
          : ['No Data'],
      colors:
        series?.todayInvitaionBonus ||
        series?.todayBettingbonus ||
        series?.todayUpgradeBonus
          ? ['#4855FD', '#4DFFBF', '#FFC635']
          : ['gray'],
      dataLabels: { enabled: false },
      tooltip: {
        enabled:
          series?.todayInvitaionBonus ||
          series?.todayBettingbonus ||
          series?.todayUpgradeBonus
            ? true
            : false,
      },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '50%',
            labels: {
              show:
                series?.todayInvitaionBonus ||
                series?.todayBettingbonus ||
                series?.todayUpgradeBonus
                  ? true
                  : false,
              name: { show: false },
              total: {
                show: false,
                showAlways: false,
              },
            },
          },
        },
      },
    },
  }
  return (
    <div className="apex-chart">
      <ApexCharts
        height={
          series?.todayInvitaionBonus ||
          series?.todayBettingbonus ||
          series?.todayUpgradeBonus
            ? 400
            : 250
        }
        width={
          series?.todayInvitaionBonus ||
          series?.todayBettingbonus ||
          series?.todayUpgradeBonus
            ? 360
            : 250
        }
        options={chartData.options as any}
        series={chartData.series}
        type={'donut'}
      />
    </div>
  )
}
