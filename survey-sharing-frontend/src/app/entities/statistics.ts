import { Survey } from "./survey";

export class Statistics{
  id!: string;
  survey!: string;
  numberOfAnswers!: number;
  percentOfUsersWhoAnswered!: number;
  minimumAge!: number;
  maximumAge!: number;
  averageAge!: number;
  numberOfMaleUsersWhoAnswered!: number;
  numberOfFemaleUsersWhoAnswered!: number;
  numberOfInvitationsSent!: number;
  percentOfInvitationsAccepted!: number;
  numberOfDifferentCountries!: number;
  listOfFeedbacks!: string[];
  numberOfPositiveFeedbacks!: number;
  numberOfNegativeFeedbacks!: number;
  averageRating!: number;
}
