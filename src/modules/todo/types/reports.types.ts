export interface TotalCountResult {
    totalCompleted: number;
    totalPending: number;
    totalCount: number;
  }


export interface PerDayCcountResult {
  countOnDay: number,
  dayOfWeek: number,
}


export interface OverDueCountResult {
  overDueTodoCount: number
}

export interface AvgCompletedPerDay {
  avgCompletedPerDay: number
}


export interface MaxCompletedPerDay {
  date: Date
  noOfTasks: number
}