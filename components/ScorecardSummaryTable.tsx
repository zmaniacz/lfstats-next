import { AgGridReact } from "ag-grid-react";
import { FullScorecard } from "types/FullScorecard";
import ChakraNextLink from "./ChakraNextLink";
import MVPModal from "./MVPModal";
import { Text } from "@chakra-ui/react";
import { gql } from "__generated__";
import { ColDef, GridOptions, ValueFormatterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

interface Props {
  eventId: number;
}

export const FullScorecardFragment = gql(/* GraphQL */ `
  fragment FullScorecardDocument on scorecards {
    id
    player {
      id
      player_name
      ipl_id
    }
    game {
      id
      tdf_id: tdf_key
      mission_start: game_datetime
      mission_length: duration
      name: game_name
      winner
    }
    team
    position
    survived
    shots_hit
    shots_fired
    times_zapped
    times_missiled
    missile_hits
    nukes_activated
    nukes_detonated
    nukes_canceled
    medic_hits
    own_medic_hits
    medic_nukes
    scout_rapid
    life_boost
    ammo_boost
    lives_left
    score
    max_score
    shots_left
    penalty_count
    shot_3hit
    elim_other_team
    team_elim
    own_nuke_cancels
    shot_opponent
    shot_team
    missiled_opponent
    missiled_team
    resupplies
    rank
    bases_destroyed
    accuracy
    hit_diff
    mvp: mvp_points
    mvp_details
    sp_earned
    sp_spent
    type
    is_sub
    uptime
    resupply_downtime
    other_downtime
    shots_fired_during_rapid
    shots_hit_during_rapid
    shot_opponent_during_rapid
    shot_team_during_rapid
    times_team_missiled
  }
`);

const GET_EVENT_FULL_SCORECARD_DATA = gql(/* GraphQL */ `
  query EventFullScorecardData($id: bigint!) {
    event: events_by_pk(id: $id) {
      scorecards {
        ...FullScorecardDocument
      }
    }
  }
`);

function accuracyFormatter(params: ValueFormatterParams) {
  return (params.value * 100).toFixed(2) + " %";
}

function hitdiffFormatter(params: ValueFormatterParams) {
  return params.value.toFixed(2);
}

export default function ScorecardSummaryTable(props: Props) {
  const { data, loading } = useQuery(GET_EVENT_FULL_SCORECARD_DATA, {
    variables: { id: props.eventId },
  });

  let rowData = null;
  //const { }
  const colDefs: ColDef[] = useMemo(
    () => [
      {
        field: "player.player_name",
        filter: true,
        headerName: "Player Name",
        flex: 2,
        cellRenderer: (props: { value: number; data: FullScorecard }) => {
          return (
            <ChakraNextLink
              href={`/players/${props.data.player.id}`}
              color={props.data.team}
            >
              {props.value}
            </ChakraNextLink>
          );
        },
      },
      {
        field: "game.name",
        filter: true,
        flex: 2,
        cellRenderer: (props: { value: string; data: FullScorecard }) => {
          return (
            <ChakraNextLink
              href={`/games/${props.data.game.id}`}
              color={props.data.game.winner}
            >
              {props.value}
            </ChakraNextLink>
          );
        },
      },
      {
        field: "position",
        filter: true,
        flex: 2,
        cellRenderer: (props: { value: string; data: FullScorecard }) => {
          return <Text color={props.data.team}>{props.value}</Text>;
        },
      },
      { field: "score", flex: 1 },
      {
        field: "mvp",
        headerName: "MVP",
        cellRenderer: (props: { value: number; data: FullScorecard }) => {
          return (
            <MVPModal mvp={props.value} mvpDetails={props.data.mvp_details} />
          );
        },
        flex: 1,
        sort: "desc",
      },
      {
        field: "hit_diff",
        headerName: "Hit Diff",
        valueFormatter: hitdiffFormatter,
        flex: 1,
      },
      { field: "medic_hits", headerName: "Medic Hits", flex: 1 },
      {
        field: "accuracy",
        valueFormatter: accuracyFormatter,
        flex: 1,
      },
      { field: "shot_team", headerName: "Shot Team", flex: 1 },
    ],
    []
  );

  const gridOptions: GridOptions = {
    sortingOrder: ["desc", "asc", null],
  };

  if (data) rowData = data.event?.scorecards;

  return (
    <div className="ag-theme-quartz-dark">
      <AgGridReact
        gridOptions={gridOptions}
        rowData={rowData}
        columnDefs={colDefs}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={false}
        domLayout="autoHeight"
      />
    </div>
  );
}
