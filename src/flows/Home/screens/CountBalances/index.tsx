import React, { FC, Fragment } from "react";
import { StyleSheet } from "react-native";
import Card from "../../../../components/Card";
import Container from "../../../../components/Container";
import ErrorView from "../../../../components/ErrorView";
import Loader from "../../../../components/Loader";
// import { useUser } from "../../../../context/userContext";
// import { getCurrentParticipantName } from "../../../../helpers";
import { colors } from "../../../../theme/colors";
import { useQueryCountById } from "../../hooks";
import { CountBalancesRoute, CountBalancesNavigation } from "../../types";
import ParticipantCell from "../CreateCount/ParticipantCell";
import ColoredLine from "./ColoredLine";
interface CountBalancesProps {
  route: CountBalancesRoute;
  navigation: CountBalancesNavigation;
}
const CountBalances: FC<CountBalancesProps> = ({ route }) => {
  const {
    data: currentCount,
    isLoading,
    error,
  } = useQueryCountById(route.params.countId);

  // const { user } = useUser();

  if (isLoading) return <Loader />;

  if (error || !currentCount) return <ErrorView />;

  // const userParticipant = getCurrentParticipantName(
  //   currentCount.participants,
  //   user,
  // );

  return (
    <Container>
      {currentCount.participants.map((p) => {
        const balanceToTotalPercent = `${Math.abs(
          (p.balance / currentCount.total) * 100
        )}%`;

        const isCreditor = p.balance > 0;

        return (
          <Card key={p.id} style={styles.card}>
            <ColoredLine
              isCreditor={isCreditor}
              balanceToTotalPercent={balanceToTotalPercent}
            />

            <ParticipantCell
              title={`${p.name}: ${p.balance.toFixed(2)}€`}
              style={styles.participantContainer}
              titleStyles={styles.participantName}
            />
          </Card>
        );
      })}

      {currentCount.participants.map((p) => {
        const hasCreditors = p.creditors.length > 0;
        const hasDebtors = p.debtors.length > 0;
        const isCreditor = p.balance > 0;

        if (!hasCreditors && !hasDebtors) return null;

        return (
          <Fragment key={p.id}>
            {p.creditors.map((creditor, i) => (
              <Card key={i} style={styles.card}>
                <ParticipantCell
                  titleStyles={{
                    ...styles.participantDebtCell,
                    color: isCreditor ? colors.green : colors.red,
                  }}
                  title={`${p.name} owes ${creditor.amount.toFixed(2)}€ to ${
                    creditor.name
                  }`}
                />
              </Card>
            ))}
            {p.debtors.map((debtor) => (
              <Card key={debtor._id} style={styles.card}>
                <ParticipantCell
                  titleStyles={{
                    ...styles.participantDebtCell,
                    color: isCreditor ? colors.green : colors.red,
                  }}
                  title={`${p.name} is owed ${debtor.amount.toFixed(2)}€ by ${
                    debtor.name
                  }`}
                />
              </Card>
            ))}
          </Fragment>
        );
      })}
    </Container>
  );
};

export default CountBalances;

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    minHeight: 20,
  },
  participantContainer: {
    justifyContent: "center",
    paddingBottom: 20,
  },
  participantDebtCell: {
    padding: 5,
  },
  participantName: {
    color: colors.black,
    fontSize: 18,
  },
});
