import { Survey } from "./survey";

export class Statistics{
  id!: number;
  survey!: Survey;
  numberOfAnswers!: number;
  percentOfUsersWhoAnswered!: number;
  minimumAge!: number;
  maximumAge!: number;
  averageAge!: number;
  numberOfMaleUsersWhoAnswered!: number;
  numberOfFemaleUsersWhoAnswered!: number;
  averageScore!: number;
  numberOfInvitationsSent!: number;
  percentOfInvitationsAccepted!: number;
  numberOfDifferentCountries!: number;
  listOfFeedbacks!: string[];
  numberOfPositiveFeedbacks!: number;
  numberOfNegativeFeedbacks!: number;
}
