import { query } from "express";

var axios = require('axios');
import {pool} from '../../utils/db'

var pgp = require('pg-promise')({
    capSQL: true
});

export default function ownedMoments(req, res) {
    let dapperID = req.params.dapperID
	let final = []

	async function search(previousCursor) {
		let momentsVariables = {
			"byForSale": null,
			"byOwnerDapperID": [`${dapperID}`],
			"byPlayers": [],
			"byPlays": [],
			"bySeries": [],
			"bySets": [],
			"bySetVisuals": [],
			"byTeams": [],
			"searchInput": {
				"pagination": {
					"cursor": `${previousCursor}`,
					"direction": "RIGHT",
					"limit": 500
				}
			},
			"sortBy": "ACQUIRED_AT_DESC"
		}

        var dataObj = JSON.stringify({
			query: `query SearchMintedMoments(
			  $sortBy: MintedMomentSortType
			  $byOwnerDapperID: [String]
			  $bySets: [ID]
			  $bySeries: [ID]
			  $bySetVisuals: [VisualIdType]
			  $byPlayers: [ID]
			  $byPlays: [ID]
			  $byTeams: [ID]
			  $byForSale: ForSaleFilter
			  $searchInput: BaseSearchInput!
		  ) {
			  searchMintedMoments(
				  input: {
					  sortBy: $sortBy
					  filters: {
						  byOwnerDapperID: $byOwnerDapperID
						  bySets: $bySets
						  bySeries: $bySeries
						  bySetVisuals: $bySetVisuals
						  byPlayers: $byPlayers
						  byPlays: $byPlays
						  byTeams: $byTeams
						  byForSale: $byForSale
					  }
					  searchInput: $searchInput
				  }
			  ) {
				  data {
					  sortBy
					  filters {
						  byOwnerDapperID
						  bySets
						  bySeries
						  bySetVisuals
						  byPlayers
						  byPlays
						  byTeams
						  byForSale
						  __typename
					  }
					  searchSummary {
						  count {
							  count
							  __typename
						  }
						  pagination {
							  leftCursor
							  rightCursor
							  __typename
						  }
						  data {
							  ... on MintedMoments {
								  size
								  data {
									  ...MomentDetails
									  __typename
								  }
								  __typename
							  }
							  __typename
						  }
						  __typename
					  }
					  __typename
				  }
				  __typename
			  }
		  }
		  fragment MomentDetails on MintedMoment {
			  id
			flowId
			flowSerialNumber
			  set {
				  id
                  setVisualId
			  }
			  setPlay {
				  ID
			  }
			  play {
				  id
			  }
			  owner {
				  dapperID
				  username
			  }
		  }`,
			variables: momentsVariables
		});

        var config = {
			method: 'post',
			url: 'https://api.nba.dapperlabs.com/marketplace/graphql',
			headers: {
				'Content-Type': 'application/json'
			},
			data: dataObj
		};

        let response = await axios(config)
		let currentCursor = response.data.data.searchMintedMoments.data.searchSummary.pagination.rightCursor
		let data = response.data.data.searchMintedMoments.data.searchSummary.data.data

        if ((currentCursor != previousCursor) && (currentCursor != "")) {
			final = await [...final, ...data]
			search(currentCursor)
        } else {
            

            const cs = new pgp.helpers.ColumnSet(['ids', 'sn'], {table: 'temp_query_meta'});
            let tmpq = await final.map(x => {
                return {
                    ids: x.setPlay.ID,
                    sn: x.flowSerialNumber
                }
            })
            const massInsertEditionMeta = pgp.helpers.insert(tmpq, cs)

            let queryText = `
                CREATE TEMP TABLE temp_query_meta(
                    ids Text,
                    sn Text
                );
                ${massInsertEditionMeta};
                SELECT * FROM temp_query_meta tmp
                LEFT JOIN "TSEditionMeta" em ON em.id = tmp.ids
                LEFT JOIN "TSEditions" e on e.id = tmp.ids;
                DROP TABLE temp_query_meta;
            `

            try {
                let dbResponse = await pool.query(queryText)
                res.send(JSON.stringify(dbResponse[2].rows))
            } catch (err) {
                console.log(err)
            }



        }
    }

    search("")
}


//FCL METHOD
//import { getTopshotAccount, getMoments} from "../../utils/fcl/getUserTSMoments";


// export default async function ownedMoments(req, res) {
//     let dapperID = req.params.dapperID
//     let result = await getTopshotAccount(dapperID)

//     let result1 = await getMoments(dapperID, result.momentIDs)
//     res.send(result1)
// }
