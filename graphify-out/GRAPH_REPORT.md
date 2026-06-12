# Graph Report - Project--root1  (2026-06-12)

## Corpus Check
- 69 files · ~16,365 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 232 nodes · 203 edges · 41 communities detected
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]

## God Nodes (most connected - your core abstractions)
1. `HealthService` - 13 edges
2. `HealthController` - 12 edges
3. `AdminService` - 9 edges
4. `FinanceService` - 8 edges
5. `HealthNutritionRepository` - 7 edges
6. `AdminController` - 7 edges
7. `FinanceController` - 7 edges
8. `TimeService` - 6 edges
9. `UserRecordRepository` - 6 edges
10. `GlobalExceptionHandler` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AdminPanel()` --calls--> `useSidebar()`  [INFERRED]
  frontend/src/app/admin/page.tsx → frontend/src/context/SidebarContext.tsx
- `AdminPanel()` --calls--> `useFetch()`  [INFERRED]
  frontend/src/app/admin/page.tsx → frontend/src/hooks/useApi.ts
- `AdminPanel()` --calls--> `useMutation()`  [INFERRED]
  frontend/src/app/admin/page.tsx → frontend/src/hooks/useApi.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (3): AdminController, AdminService, UserRecordRepository

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (5): HealthController, handleDeleteNutrition(), handleNutritionSubmit(), handleWorkoutSubmit(), refetchAllNutrition()

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (5): FinanceController, handleDelete(), handleEdit(), handleSubmit(), TimeController

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (2): HealthService, HealthWorkoutRepository

### Community 4 - "Community 4"
Cohesion: 0.2
Nodes (2): FinanceService, FinanceTransactionRepository

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (1): HealthNutritionRepository

### Community 6 - "Community 6"
Cohesion: 0.24
Nodes (2): TimeEventRepository, TimeService

### Community 7 - "Community 7"
Cohesion: 0.25
Nodes (2): UserActivityRepository, UserActivityService

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (4): AdminPanel(), useSidebar(), useFetch(), useMutation()

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (1): GlobalExceptionHandler

### Community 10 - "Community 10"
Cohesion: 0.5
Nodes (1): UserActivityController

### Community 11 - "Community 11"
Cohesion: 0.5
Nodes (1): ApiError

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (1): LuminaEdgeApplication

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (2): ExerciseResponse, WorkoutResponse

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (1): SwaggerConfig

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (1): WebConfig

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (2): ExerciseSet, HealthExercise

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (1): PaymentController

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (1): HealthExerciseRepository

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): ExerciseRequest

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (1): EventRequest

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): UserRecordResponse

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (1): AddMemberRequest

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (1): WorkoutRequest

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): ExerciseSetDto

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): NutritionSummaryResponse

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): ActivityEventRequest

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): TransactionRequest

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): NutritionRequest

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (1): AdminMetricsResponse

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): FinanceSummaryResponse

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (1): ActivityHourlyResponse

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (1): EventResponse

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (1): AdminAnalyticsResponse

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (1): TransactionResponse

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): FinanceTransaction

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (1): UserRecord

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): HealthNutrition

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (1): TimeEvent

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (1): UserActivity

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (1): HealthWorkout

## Knowledge Gaps
- **27 isolated node(s):** `HealthExerciseRepository`, `ExerciseRequest`, `EventRequest`, `UserRecordResponse`, `AddMemberRequest` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 3`** (16 nodes): `HealthService`, `.addExercise()`, `.createWorkout()`, `.deleteNutrition()`, `.deleteWorkout()`, `.getWorkout()`, `.getWorkoutsByDate()`, `.logNutrition()`, `.toWorkoutResponse()`, `.updateNutrition()`, `.updateWorkout()`, `HealthWorkoutRepository`, `.findAllByUserIdOrderByWorkoutDateDesc()`, `.findByUserIdAndWorkoutDateOrderByCreatedAtDesc()`, `HealthWorkoutRepository.java`, `HealthService.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (14 nodes): `FinanceService`, `.createTransaction()`, `.deleteTransaction()`, `.getSummary()`, `.getTransactions()`, `.getYearlySummary()`, `.toResponse()`, `.updateTransaction()`, `FinanceTransactionRepository`, `.findByUserIdAndTransactionDateBetween()`, `.sumExpenseByDateRange()`, `.sumIncomeByDateRange()`, `FinanceTransactionRepository.java`, `FinanceService.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (10 nodes): `HealthNutritionRepository`, `.findAllByUserIdOrderByLogDateDesc()`, `.findByUserIdAndLogDateOrderByCreatedAtDesc()`, `.sumCaloriesByDate()`, `.sumCarbsByDate()`, `.sumFatsByDate()`, `.sumProteinByDate()`, `.getNutritionByDate()`, `.getNutritionSummary()`, `HealthNutritionRepository.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (10 nodes): `TimeEventRepository.java`, `TimeService.java`, `TimeEventRepository`, `.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc()`, `TimeService`, `.createEvent()`, `.deleteEvent()`, `.getEvents()`, `.toResponse()`, `.updateEvent()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 7`** (8 nodes): `UserActivityRepository.java`, `UserActivityService.java`, `UserActivityRepository`, `.countByHour()`, `.countByUserId()`, `UserActivityService`, `.getHourlyActivity()`, `.logBatch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (6 nodes): `GlobalExceptionHandler`, `.handleBadRequest()`, `.handleGenericError()`, `.handleNotFound()`, `.handleValidationErrors()`, `GlobalExceptionHandler.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (4 nodes): `UserActivityController.java`, `UserActivityController`, `.getHourlyActivity()`, `.logBatch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (4 nodes): `ApiError`, `.constructor()`, `fetchApi()`, `api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (3 nodes): `LuminaEdgeApplication.java`, `LuminaEdgeApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (3 nodes): `WorkoutResponse.java`, `ExerciseResponse`, `WorkoutResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (3 nodes): `SwaggerConfig.java`, `SwaggerConfig`, `.luminaOpenAPI()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (3 nodes): `WebConfig.java`, `WebConfig`, `.addCorsMappings()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (3 nodes): `ExerciseSet`, `HealthExercise`, `HealthExercise.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (3 nodes): `PaymentController.java`, `PaymentController`, `.processPayment()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (2 nodes): `HealthExerciseRepository`, `HealthExerciseRepository.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `ExerciseRequest`, `ExerciseRequest.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `EventRequest`, `EventRequest.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `UserRecordResponse.java`, `UserRecordResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `AddMemberRequest`, `AddMemberRequest.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `WorkoutRequest.java`, `WorkoutRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `ExerciseSetDto`, `ExerciseSetDto.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `NutritionSummaryResponse.java`, `NutritionSummaryResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `ActivityEventRequest`, `ActivityEventRequest.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `TransactionRequest.java`, `TransactionRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `NutritionRequest.java`, `NutritionRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `AdminMetricsResponse`, `AdminMetricsResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `FinanceSummaryResponse`, `FinanceSummaryResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `ActivityHourlyResponse`, `ActivityHourlyResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `EventResponse`, `EventResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `AdminAnalyticsResponse`, `AdminAnalyticsResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `TransactionResponse.java`, `TransactionResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `FinanceTransaction`, `FinanceTransaction.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `UserRecord.java`, `UserRecord`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `HealthNutrition`, `HealthNutrition.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `TimeEvent.java`, `TimeEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `UserActivity.java`, `UserActivity`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `HealthWorkout`, `HealthWorkout.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HealthService` connect `Community 3` to `Community 5`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `HealthExerciseRepository`, `ExerciseRequest`, `EventRequest` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._