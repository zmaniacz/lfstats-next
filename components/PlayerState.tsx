import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  StatGroup,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { BsCircleFill } from "react-icons/bs";
import { GameEntityState } from "../types/GameEntityState";
import { GameEntity } from "../types/GameEntity";
import { GameTeam } from "../types/GameTeam";
import { millisToMinutesAndSeconds } from "../lib/helper";
import { PositionIcon } from "./PositionIcon";
import { StatDisplay } from "./StatDisplay";

export interface PlayerProps {
  team: GameTeam;
  entity: Omit<GameEntity, "game_entity_states">;
  state: GameEntityState;
}

export const PlayerState: FC<PlayerProps> = ({ team, entity, state }) => {
  useEffect(() => {
    console.log(`Mounted playerState for ${entity.entity_desc}`);
  }, [entity]);

  useEffect(() => {
    //   NOTE: useful for investigating how often this recomputes, but quite noisy
    //     console.log(`Updated playerState for ${entity.entity_desc}`)
  }, [state]);

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box px={1} color={`${team.ui_color}.500`}>
            <PositionIcon position={entity.position} />
          </Box>
          <Box px={1}>
            <Flex>
              <Heading
                size="sm"
                color={`${team.ui_color}.600`}
                textDecoration={
                  state?.is_eliminated ? "line-through" : undefined
                }
                noOfLines={1}
              >
                {entity.entity_desc}(
                {millisToMinutesAndSeconds(state?.state_time)})
              </Heading>
              <Center>
                <BsCircleFill
                  color={
                    state?.is_active ?? true
                      ? "green"
                      : state?.last_deac_type === "resupply"
                      ? "yellow"
                      : "red"
                  }
                />
              </Center>
            </Flex>
          </Box>
          <Spacer />
          <Box
            px={1}
            display={{
              base: "none",
              sm: "contents",
            }}
          >
            <StatGroup>
              <StatDisplay value={state?.score || 0} name="Score" />
              <StatDisplay
                value={state?.sp_earned - state?.sp_spent || 0}
                name="Spec"
              />
              {/* <StatDisplay value="N/A" name="MVP" /> */}
              <StatDisplay value={state?.lives || 0} name="Lives" />{" "}
              <StatDisplay value={state?.shots || 0} name="Shots" />
            </StatGroup>
          </Box>
          <Box
            px={1}
            display={{
              base: "contents",
              sm: "none",
            }}
          >
            {state?.score || 0}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {!state ? (
          <div>NO DATA!</div>
        ) : (
          <>
            <SimpleGrid minChildWidth="120px">
              <Box
                display={{
                  base: "contents",
                  sm: "none",
                }}
              >
                <StatDisplay value={state.score} name="Score" />
                <StatDisplay value="N/A" name="MVP" />
              </Box>
              <StatDisplay
                value={(state.accuracy * 100).toFixed(2) + "%"}
                name="Accuracy"
              />
              <StatDisplay name="Hit Diff" value={state.hit_diff.toFixed(2)} />
              <StatDisplay name="Medic Hits" value={state.medic_hits} />
              <StatDisplay name="Assists" value={state.assists} />
              {state.cancel_opponent_nuke > 0 && (
                <StatDisplay
                  name="Nuke Cancels"
                  value={state.cancel_opponent_nuke}
                />
              )}
              {state.cancel_team_nuke > 0 && (
                <StatDisplay
                  name="Team Nuke Cancels"
                  value={state.cancel_team_nuke}
                />
              )}
              {state.cancel_team_nuke_by_resupply > 0 && (
                <StatDisplay
                  name="Team Resupply Nuke Cancels"
                  value={state.cancel_team_nuke_by_resupply}
                />
              )}
              {state.own_medic_hits > 0 && (
                <StatDisplay
                  name="Own Medic Hits"
                  value={state.own_medic_hits}
                  size="xl"
                />
              )}
              <StatDisplay name="Shots Left" value={state.shots} />
              <StatDisplay name="Lives Left" value={state.lives} />
              {state.self_missile > 0 && (
                <StatDisplay name="Times Missiled" value={state.self_missile} />
              )}
              {entity.position !== "Heavy Weapons" && (
                <>
                  <StatDisplay name="SP Earned" value={state.sp_earned} />
                  <StatDisplay name="SP Spent" value={state.sp_spent} />
                </>
              )}
              {state.penalties > 0 && (
                <StatDisplay name="Penalties" value={state.penalties} />
              )}
            </SimpleGrid>

            <Accordion allowMultiple allowToggle>
              <AccordionItem>
                <h1>
                  <AccordionButton>
                    <Box>
                      <Heading size="xs">Hit Stats</Heading>
                    </Box>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                </h1>
                <AccordionPanel>
                  <SimpleGrid minChildWidth="120px">
                    <StatDisplay name="Shots Fired" value={state.shots_fired} />
                    <StatDisplay name="Shots Hit" value={state.shots_hit} />
                    <StatDisplay
                      name="Shot Opponent"
                      value={state.shot_opponent}
                    />
                    <StatDisplay
                      name="Deac Opponent"
                      value={state.deac_opponent}
                    />
                    <StatDisplay name="Shot 3-Hit" value={state.shot_3hit} />
                    <StatDisplay name="Deac 3-Hit" value={state.deac_3hit} />
                    <StatDisplay name="Times Hit" value={state.self_hit} />
                    <StatDisplay name="Times Deac-ed" value={state.self_deac} />
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h1>
                  <AccordionButton>
                    <Box>
                      <Heading size="xs">Resupply Stats</Heading>
                    </Box>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                </h1>
                <AccordionPanel>
                  <SimpleGrid minChildWidth="120px">
                    {entity.position === "Ammo Carrier" && (
                      <>
                        <StatDisplay
                          name="Players Resupplied (Shots)"
                          value={state.resupply_shots}
                        />
                        <StatDisplay
                          name="Ammo Boosts Activated"
                          value={state.ammo_boosts}
                        />
                        <StatDisplay
                          name="Players Boosted (Shots)"
                          value={state.ammo_boosted_players}
                        />
                      </>
                    )}
                    {entity.position === "Medic" && (
                      <>
                        <StatDisplay
                          name="Players Resupplied (Lives)"
                          value={state.resupply_lives}
                        />
                        <StatDisplay
                          name="Life Boosts Activated"
                          value={state.life_boosts}
                        />
                        <StatDisplay
                          name="Players Boosted (Lives)"
                          value={state.life_boosted_players}
                        />
                      </>
                    )}
                    {entity.position !== "Ammo Carrier" && (
                      <>
                        <StatDisplay
                          name="Ammo Resupplies"
                          value={state.self_resupply_shots}
                        />
                        <StatDisplay
                          name="Ammo Boosts"
                          value={state.ammo_boost_received}
                        />
                      </>
                    )}
                    {entity.position !== "Medic" && (
                      <>
                        <StatDisplay
                          name="Lives Resupplies"
                          value={state.self_resupply_lives}
                        />
                        <StatDisplay
                          name="Life Boosts"
                          value={state.life_boost_received}
                        />
                      </>
                    )}
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
              {entity.position === "Scout" && (
                <AccordionItem>
                  <h1>
                    <AccordionButton>
                      <Box>
                        <Heading size="xs">Rapid Fire</Heading>
                      </Box>
                      <Spacer />
                      <AccordionIcon />
                    </AccordionButton>
                  </h1>
                  <AccordionPanel>
                    <SimpleGrid minChildWidth="120px">
                      <StatDisplay
                        name="Rapid Fires"
                        value={state.rapid_fires}
                      />
                      <StatDisplay
                        name="Accuracy"
                        value={
                          (state.accuracy_during_rapid * 100).toFixed(2) + "%"
                        }
                      />
                      <StatDisplay
                        name="Hit Diff"
                        value={state.hit_diff_during_rapid.toFixed(2)}
                      />
                      <StatDisplay
                        name="Assists"
                        value={state.assists_during_rapid}
                      />
                      <StatDisplay
                        name="Shots Fired"
                        value={state.shots_fired_during_rapid}
                      />
                      <StatDisplay
                        name="Shots Hit"
                        value={state.shots_hit_during_rapid}
                      />
                      <StatDisplay
                        name="Shot Opponent"
                        value={state.shot_opponent_during_rapid}
                      />
                      <StatDisplay
                        name="Deac Opponent"
                        value={state.deac_opponent_during_rapid}
                      />
                      <StatDisplay
                        name="Shot 3-Hit"
                        value={state.shot_3hit_during_rapid}
                      />
                      <StatDisplay
                        name="Deac 3-Hit"
                        value={state.deac_3hit_during_rapid}
                      />
                      <StatDisplay
                        name="Shot Team"
                        value={state.shot_team_during_rapid}
                      />
                      <StatDisplay
                        name="Deac Team"
                        value={state.deac_team_during_rapid}
                      />
                      <StatDisplay
                        name="Medic Hits"
                        value={state.medic_hits_during_rapid}
                      />
                      <StatDisplay
                        name="Times Hit"
                        value={state.self_hit_during_rapid}
                      />
                      <StatDisplay
                        name="Times Deac-ed"
                        value={state.self_deac_during_rapid}
                      />
                      <StatDisplay
                        name="Times Missiled"
                        value={state.self_missile_during_rapid}
                      />
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              )}
              {(entity.position === "Heavy Weapons" ||
                entity.position === "Commander") && (
                <AccordionItem>
                  <h1>
                    <AccordionButton>
                      <Box>
                        <Heading size="xs">Missile Stats</Heading>
                      </Box>
                      <Spacer />
                      <AccordionIcon />
                    </AccordionButton>
                  </h1>
                  <AccordionPanel>
                    <SimpleGrid minChildWidth="120px">
                      <StatDisplay
                        name="Missile Opponent"
                        value={state.missile_opponent}
                      />
                      <StatDisplay
                        name="Missile Base"
                        value={state.missile_base}
                      />
                      <StatDisplay
                        name="Missile Team"
                        value={state.missile_team}
                      />

                      <StatDisplay
                        name="Missiles Left"
                        value={state.missiles_left}
                      />
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              )}
              {entity.position === "Commander" && (
                <AccordionItem>
                  <h1>
                    <AccordionButton>
                      <Box>
                        <Heading size="xs">Nuke Stats</Heading>
                      </Box>
                      <Spacer />
                      <AccordionIcon />
                    </AccordionButton>
                  </h1>
                  <AccordionPanel>
                    <SimpleGrid minChildWidth="120px">
                      <StatDisplay
                        name="Nukes Activated"
                        value={state.nukes_activated}
                      />
                      <StatDisplay
                        name="Nukes Detonated"
                        value={state.nukes_detonated}
                      />
                      <StatDisplay
                        name="Nuke Medic hits"
                        value={state.nuke_medic_hits}
                      />
                      {state.own_nuke_canceled_by_opponent > 0 && (
                        <StatDisplay
                          name="Own Nuke Canceled (Opponent)"
                          value={state.own_nuke_canceled_by_opponent}
                        />
                      )}
                      {state.own_nuke_canceled_by_team > 0 && (
                        <StatDisplay
                          name="Own Nuke Canceled (Team)"
                          value={state.own_nuke_canceled_by_team}
                        />
                      )}
                      {state.own_nuke_canceled_by_nuke > 0 && (
                        <StatDisplay
                          name="Own Nuke Canceled (Nuke)"
                          value={state.own_nuke_canceled_by_nuke}
                        />
                      )}
                      {state.own_nuke_canceled_by_resupply > 0 && (
                        <StatDisplay
                          name="Own Nuke Canceled (Resupply)"
                          value={state.own_nuke_canceled_by_resupply}
                        />
                      )}
                      {state.own_nuke_canceled_by_game_end > 0 && (
                        <StatDisplay
                          name="Own Nuke Canceled (Game End)"
                          value={state.own_nuke_canceled_by_game_end}
                        />
                      )}
                      {state.own_nuke_canceled_by_penalty > 0 && (
                        <StatDisplay
                          name="Own Nuke Canceled (Penalty)"
                          value={state.own_nuke_canceled_by_penalty}
                        />
                      )}
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              )}
              <AccordionItem>
                <h1>
                  <AccordionButton>
                    <Box>
                      <Heading size="xs">Bases</Heading>
                    </Box>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                </h1>
                <AccordionPanel>
                  <SimpleGrid minChildWidth="120px">
                    <StatDisplay
                      name="Bases Destroyed"
                      value={state.destroy_base}
                    />
                    <StatDisplay name="Shot Base" value={state.shot_base} />
                    <StatDisplay name="Miss Base" value={state.miss_base} />
                    <StatDisplay
                      name="Missile Base"
                      value={state.missile_base}
                    />
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <h1>
                  <AccordionButton>
                    <Box>
                      <Heading size="xs">Uptime</Heading>
                    </Box>
                    <Spacer />
                    <AccordionIcon />
                  </AccordionButton>
                </h1>
                <AccordionPanel>
                  <SimpleGrid minChildWidth="120px">
                    <StatDisplay
                      name="Total Time"
                      value={millisToMinutesAndSeconds(
                        state.uptime +
                          state.opp_deac_downtime +
                          state.nuke_downtime +
                          state.resupply_downtime +
                          state.team_deac_downtime +
                          state.penalty_downtime
                      )}
                    />
                    <StatDisplay
                      name="Uptime"
                      value={millisToMinutesAndSeconds(state.uptime)}
                    />
                    <StatDisplay
                      name="Downtime Opponent"
                      value={millisToMinutesAndSeconds(state.opp_deac_downtime)}
                    />
                    <StatDisplay
                      name="Downtime Nuke"
                      value={millisToMinutesAndSeconds(state.nuke_downtime)}
                    />
                    <StatDisplay
                      name="Downtime Resupply"
                      value={millisToMinutesAndSeconds(state.resupply_downtime)}
                    />
                    <StatDisplay
                      name="Downtime Team"
                      value={millisToMinutesAndSeconds(
                        state.team_deac_downtime
                      )}
                    />
                    <StatDisplay
                      name="Downtime - Penalty"
                      value={millisToMinutesAndSeconds(state.penalty_downtime)}
                    />
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};
