
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export const getTopshotAccount = async (address) => {
  const resp = await fcl.send([
    fcl.script`
  import TopShot from 0x0b2a3299cc857e29
  import Market from 0xc1e4f4f4c4257510
  pub struct TopshotAccount {
    pub var momentIDs: [UInt64]
    pub var saleMomentIDs: [UInt64]
    pub var hasV3: Bool
    init(momentIDs: [UInt64], saleMomentIDs: [UInt64], hasV3: Bool) {
      self.momentIDs = momentIDs
      self.saleMomentIDs = saleMomentIDs
      self.hasV3 = hasV3!
    }
  }
  pub fun main(): TopshotAccount {
  let acct = getAccount(0x${address})
  let collectionRef = acct.getCapability(/public/MomentCollection)!
                .borrow<&{TopShot.MomentCollectionPublic}>()!
  let momentIDs = collectionRef.getIDs()
  var saleMomentIDs: [UInt64] = []
  var hasV3: Bool = false
  if let marketV3CollectionRef = acct.getCapability(/public/topshotSalev3Collection)
                .borrow<&{Market.SalePublic}>() {
     saleMomentIDs = marketV3CollectionRef.getIDs()
     hasV3 = true
  } else {
     let salePublic = acct.getCapability(/public/topshotSaleCollection)
     if salePublic!.check<&{Market.SalePublic}>(){
      let saleCollectionRef = salePublic!.borrow<&{Market.SalePublic}>() ?? panic("Could not borrow capability from public collection")
      saleMomentIDs = saleCollectionRef.getIDs()  
     }
  }
  return TopshotAccount(momentIDs: momentIDs, saleMomentIDs: saleMomentIDs, hasV3: hasV3)
}  `,
  ])
  return fcl.decode(resp)
}

export const getMoments = async (address, momentIDs) => {
  if (momentIDs && momentIDs.length === 0) {
    return []
  }
  const resp = await fcl.send([
    fcl.script`
  import TopShot from 0x0b2a3299cc857e29
  pub struct Moment {
    pub var id: UInt64?
    pub var playId: UInt32?
    pub var setId: UInt32?
    pub var serialNumber: UInt32?
    init(_ moment: &TopShot.NFT?) {
      self.id = moment?.id
      self.playId = moment?.data?.playID
      self.setId = moment?.data?.setID
      self.serialNumber = moment?.data?.serialNumber
    }
  }
  pub fun main(momentIDs: [UInt64]): [Moment] {
  let acct = getAccount(0x${address})
  let collectionRef = acct.getCapability(/public/MomentCollection)!
                .borrow<&{TopShot.MomentCollectionPublic}>()!
    var moments: [Moment] = []
    for momentID in momentIDs {
      moments.append(Moment(collectionRef.borrowMoment(id: momentID)))
    }
    return moments
}  `,
    fcl.args([fcl.arg(momentIDs, t.Array(t.UInt64))]),
  ])
  return fcl.decode(resp)
}

