import React from 'react'
import InvitePartner from './InvitePartner'
import AwardsIssued from './AwardsIssued'
import LeaderBoard from './LeaderBoard'
import CommissionSection from './CommissionSection'
import InvitationBonus from './InvitationBonus'
import Blog from './Blog'

const ToInvite = () => {
  return (
    <>
      <InvitePartner />
      <AwardsIssued />
      <InvitationBonus />
      <CommissionSection />
      <LeaderBoard />
      <Blog />
    </>
  )
}

export default ToInvite
