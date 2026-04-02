# Sinif Diyagrami (Class Diagram) — Hayvan Yardim Sistemi

```mermaid
classDiagram
    direction TB

    %% ════════════════════════════════════════════════════════
    %% ENTITY / MODEL CLASSES (Database Tables)
    %% ════════════════════════════════════════════════════════

    class User {
        +int id
        +string email
        +string password_hash
        +UserRole role
        +string first_name
        +string last_name
        +string? phone
        +string? avatar_url
        +decimal? latitude
        +decimal? longitude
        +decimal reliability_score
        +boolean is_active
        +datetime created_at
        +datetime updated_at
    }

    class Report {
        +int id
        +int reporter_id
        +ReportType type
        +string description
        +decimal latitude
        +decimal longitude
        +string? address
        +string? photo_url
        +Priority priority
        +ReportStatus status
        +string? correction_note
        +datetime created_at
        +datetime updated_at
    }

    class Animal {
        +int id
        +int report_id
        +string? species
        +string? description
        +AnimalCondition condition_level
        +string? photo_url
        +AnimalStatus status
        +datetime created_at
        +datetime updated_at
    }

    class Task {
        +int id
        +int? report_id
        +int? assigned_by
        +int? assigned_to
        +TaskType type
        +TaskStatus status
        +Priority priority
        +string? notes
        +string? rejection_reason
        +datetime? deadline
        +datetime? started_at
        +datetime? completed_at
        +datetime created_at
        +datetime updated_at
    }

    class TaskEvidence {
        +int id
        +int task_id
        +int uploaded_by
        +string photo_url
        +string? description
        +datetime created_at
    }

    class FeedingPoint {
        +int id
        +string name
        +decimal latitude
        +decimal longitude
        +string? description
        +FeedingPointStatus status
        +datetime? last_refill_at
        +int created_by
        +datetime created_at
        +datetime updated_at
    }

    class FeedingPointRefill {
        +int id
        +int feeding_point_id
        +int volunteer_id
        +RefillType refill_type
        +string? note
        +string? photo_url
        +RefillStatus status
        +int? approved_by
        +datetime created_at
    }

    class VetAvailability {
        +int id
        +int vet_id
        +boolean is_available
        +VetWorkload workload
        +string? note
        +datetime updated_at
    }

    class VetCase {
        +int id
        +int animal_id
        +int vet_id
        +int? task_id
        +string? diagnosis
        +string? treatment
        +VetCaseOutcome outcome
        +string? notes
        +datetime created_at
        +datetime updated_at
    }

    class Donation {
        +int id
        +int donor_id
        +decimal amount
        +string? payment_method
        +string? note
        +datetime created_at
    }

    class Purchase {
        +int id
        +int admin_id
        +string description
        +decimal amount
        +string? receipt_url
        +datetime created_at
    }

    class Notification {
        +int id
        +int user_id
        +string title
        +string message
        +NotificationType type
        +boolean is_read
        +string? related_type
        +int? related_id
        +datetime created_at
    }

    class SystemSetting {
        +int id
        +string setting_key
        +string setting_value
        +int? updated_by
        +datetime updated_at
    }

    %% ════════════════════════════════════════════════════════
    %% ENUM CLASSES
    %% ════════════════════════════════════════════════════════

    class UserRole {
        <<enumeration>>
        admin
        advisor
        volunteer
        vet
        user
    }

    class ReportType {
        <<enumeration>>
        injured_animal
        feeding_point
    }

    class Priority {
        <<enumeration>>
        low
        medium
        high
        urgent
    }

    class ReportStatus {
        <<enumeration>>
        pending
        approved
        assigned
        in_progress
        completed
        rejected
        needs_correction
    }

    class TaskStatus {
        <<enumeration>>
        pending
        accepted
        rejected
        in_progress
        completed
        cancelled
    }

    class TaskType {
        <<enumeration>>
        rescue
        feeding
        vet_transport
        other
    }

    class AnimalCondition {
        <<enumeration>>
        minor
        moderate
        severe
        critical
    }

    class AnimalStatus {
        <<enumeration>>
        reported
        in_rescue
        at_vet
        treated
        released
        deceased
    }

    class FeedingPointStatus {
        <<enumeration>>
        active
        needs_refill
        inactive
    }

    class RefillType {
        <<enumeration>>
        food
        water
        both
    }

    class RefillStatus {
        <<enumeration>>
        pending
        approved
        rejected
    }

    class VetWorkload {
        <<enumeration>>
        light
        moderate
        heavy
    }

    class VetCaseOutcome {
        <<enumeration>>
        ongoing
        recovered
        released
        deceased
    }

    class NotificationType {
        <<enumeration>>
        task_assigned
        task_updated
        report_status
        donation
        system
        vet_request
    }

    %% ════════════════════════════════════════════════════════
    %% REPOSITORY CLASSES (Data Access Layer)
    %% ════════════════════════════════════════════════════════

    class BaseRepository~T~ {
        <<abstract>>
        #string table
        +findAll(limit, offset) T[]
        +findById(id) T?
        +findWhere(conditions, limit, offset) T[]
        +count(conditions?) int
        +create(data) int
        +update(id, data) boolean
        +delete(id) boolean
        +query(sql, params?) R[]
        +execute(sql, params?) ResultSetHeader
    }

    class UserRepository {
        +findByEmail(email) UserRow?
        +findByRole(role, limit, offset) UserRow[]
        +findActiveVolunteersNear(lat, lng, radiusKm, limit) UserRow[]
        +updateReliability(userId, score) boolean
    }

    class ReportRepository {
        +findByStatus(status, limit, offset) ReportRow[]
        +findByReporter(reporterId, limit, offset) ReportRow[]
        +findPending(limit, offset) ReportRow[]
        +findNear(lat, lng, radiusKm, limit) ReportRow[]
    }

    class TaskRepository {
        +findByVolunteer(volunteerId, status?) TaskRow[]
        +findActiveByVolunteer(volunteerId) TaskRow[]
        +hasConflict(volunteerId) boolean
    }

    class FeedingPointRepository {
        +findActive() FeedingPointRow[]
        +findNeedingRefill() FeedingPointRow[]
        +createRefill(data) int
        +findRefillsByPoint(feedingPointId) RefillRow[]
    }

    class AnimalRepository {
        +findByReport(reportId) AnimalRow?
        +findByStatus(status) AnimalRow[]
    }

    class VetRepository {
        +findAvailableVets() VetAvailabilityRow[]
        +upsertAvailability(vetId, data) void
        +createCase(data) int
        +findCasesByVet(vetId) VetCaseRow[]
        +updateCase(caseId, data) boolean
    }

    class DonationRepository {
        +totalDonations() number
        +totalPurchases() number
        +getBalance() number
        +createPurchase(data) int
    }

    class NotificationRepository {
        +findByUser(userId, unreadOnly, limit, offset) NotificationRow[]
        +markAsRead(notificationId) boolean
        +markAllAsRead(userId) void
        +send(userId, title, message, type, relatedType?, relatedId?) int
    }

    %% ════════════════════════════════════════════════════════
    %% SERVICE CLASSES (Business Logic Layer)
    %% ════════════════════════════════════════════════════════

    class AuthService {
        +register(dto) UserRow, token
        +login(dto) UserRow, token
        +me(payload) UserRow
    }

    class UserService {
        +getAll(limit?, offset?) UserRow[]
        +getById(id) UserRow
        +getByRole(role, limit?, offset?) UserRow[]
        +create(dto) UserRow
        +update(id, dto) UserRow
        +delete(id) void
        +updateLocation(id, lat, lng) void
        +getNearbyVolunteers(lat, lng, radiusKm?) UserRow[]
    }

    class ReportService {
        +getAll(limit?, offset?) ReportRow[]
        +getById(id) ReportRow
        +getPending(limit?, offset?) ReportRow[]
        +getByReporter(reporterId) ReportRow[]
        +getNearby(lat, lng, radiusKm?) ReportRow[]
        +create(reporterId, dto) ReportRow
        +updateStatus(id, dto) ReportRow
    }

    class TaskService {
        +getAll(limit?, offset?) TaskRow[]
        +getById(id) TaskRow
        +getByVolunteer(volunteerId) TaskRow[]
        +create(advisorId, dto) TaskRow
        +updateStatus(taskId, userId, dto) TaskRow
        +addEvidence(taskId, userId, photoUrl, description?) void
    }

    class FeedingPointService {
        +getAll(limit?, offset?) FeedingPointRow[]
        +getById(id) FeedingPointRow
        +create(createdBy, dto) FeedingPointRow
        +refill(feedingPointId, volunteerId, dto) int
        +approveRefill(refillId, advisorId) void
        +getRefills(feedingPointId) RefillRow[]
    }

    class VetService {
        +getAvailableVets() VetAvailabilityRow[]
        +updateAvailability(vetId, dto) void
        +createCase(vetId, dto) int
        +updateCase(caseId, dto) void
        +getCasesByVet(vetId) VetCaseRow[]
    }

    class DonationService {
        +getAll(limit?, offset?) DonationRow[]
        +getBalance() number
        +donate(donorId, dto) DonationRow
        +purchase(adminId, dto) int
    }

    %% ════════════════════════════════════════════════════════
    %% HELPER / UTILITY CLASSES
    %% ════════════════════════════════════════════════════════

    class ApiError {
        +int statusCode
        +string message
        +unknown? details
        +badRequest(message, details)$ ApiError
        +unauthorized(message)$ ApiError
        +forbidden(message)$ ApiError
        +notFound(message)$ ApiError
        +conflict(message)$ ApiError
        +internal(message)$ ApiError
    }

    class ApiResponse {
        <<utility>>
        +success(data, meta?, status)$ Response
        +created(data)$ Response
        +noContent()$ Response
        +error(err)$ Response
    }

    class AuthHelper {
        <<utility>>
        +hashPassword(password)$ string
        +comparePassword(password, hash)$ boolean
        +signToken(payload)$ string
        +verifyToken(token)$ JwtPayload
        +getAuth(req)$ JwtPayload
        +requireRole(req, ...roles)$ JwtPayload
    }

    class JwtPayload {
        +int userId
        +string email
        +UserRole role
    }

    class ControllerHelper {
        <<utility>>
        +handler(fn)$ Function
        +validate(req, schema)$ T
        +pagination(req)$ limit, offset
        +param(req, key)$ string?
    }

    %% ════════════════════════════════════════════════════════
    %% DTO CLASSES (Validation Schemas)
    %% ════════════════════════════════════════════════════════

    class RegisterDto {
        <<dto>>
        +string email
        +string password
        +UserRole role
        +string first_name
        +string last_name
        +string? phone
    }

    class LoginDto {
        <<dto>>
        +string email
        +string password
    }

    class CreateUserDto {
        <<dto>>
        +string email
        +string password
        +UserRole role
        +string first_name
        +string last_name
        +string? phone
    }

    class UpdateUserDto {
        <<dto>>
        +string? first_name
        +string? last_name
        +string? phone
        +string? avatar_url
        +decimal? latitude
        +decimal? longitude
        +boolean? is_active
    }

    class CreateReportDto {
        <<dto>>
        +ReportType type
        +string description
        +decimal latitude
        +decimal longitude
        +string? address
        +string? photo_url
        +string? species
        +AnimalCondition? condition_level
    }

    class UpdateReportStatusDto {
        <<dto>>
        +ReportStatus status
        +string? correction_note
        +Priority? priority
    }

    class CreateTaskDto {
        <<dto>>
        +int? report_id
        +int assigned_to
        +TaskType type
        +Priority? priority
        +string? notes
        +datetime? deadline
    }

    class UpdateTaskStatusDto {
        <<dto>>
        +TaskStatus status
        +string? rejection_reason
    }

    class CreateFeedingPointDto {
        <<dto>>
        +string name
        +decimal latitude
        +decimal longitude
        +string? description
    }

    class RefillFeedingPointDto {
        <<dto>>
        +RefillType refill_type
        +string? note
        +string? photo_url
    }

    class CreateDonationDto {
        <<dto>>
        +decimal amount
        +string? payment_method
        +string? note
    }

    class CreatePurchaseDto {
        <<dto>>
        +string description
        +decimal amount
        +string? receipt_url
    }

    class CreateVetCaseDto {
        <<dto>>
        +int animal_id
        +int? task_id
        +string? diagnosis
        +string? treatment
        +string? notes
    }

    class UpdateVetCaseDto {
        <<dto>>
        +string? diagnosis
        +string? treatment
        +VetCaseOutcome? outcome
        +string? notes
    }

    class UpdateVetAvailabilityDto {
        <<dto>>
        +boolean is_available
        +VetWorkload? workload
        +string? note
    }

    %% ════════════════════════════════════════════════════════
    %% ENTITY RELATIONSHIPS
    %% ════════════════════════════════════════════════════════

    User "1" --> "*" Report : reports
    User "1" --> "*" Task : assigned tasks
    User "1" --> "*" Task : created tasks
    User "1" --> "*" FeedingPoint : creates
    User "1" --> "*" FeedingPointRefill : refills
    User "1" --> "*" Donation : donates
    User "1" --> "*" Purchase : purchases
    User "1" --> "*" Notification : receives
    User "1" --> "*" TaskEvidence : uploads
    User "1" --> "0..1" VetAvailability : availability
    User "1" --> "*" VetCase : handles
    User "1" --> "*" SystemSetting : updates

    Report "1" --> "0..1" Animal : has animal
    Report "1" --> "*" Task : generates tasks

    Task "1" --> "*" TaskEvidence : has evidence
    Task "1" --> "*" VetCase : linked cases

    Animal "1" --> "*" VetCase : vet cases

    FeedingPoint "1" --> "*" FeedingPointRefill : refills

    %% Enum usage
    User ..> UserRole
    Report ..> ReportType
    Report ..> Priority
    Report ..> ReportStatus
    Task ..> TaskType
    Task ..> TaskStatus
    Task ..> Priority
    Animal ..> AnimalCondition
    Animal ..> AnimalStatus
    FeedingPoint ..> FeedingPointStatus
    FeedingPointRefill ..> RefillType
    FeedingPointRefill ..> RefillStatus
    VetAvailability ..> VetWorkload
    VetCase ..> VetCaseOutcome
    Notification ..> NotificationType

    %% ════════════════════════════════════════════════════════
    %% REPOSITORY INHERITANCE
    %% ════════════════════════════════════════════════════════

    BaseRepository~T~ <|-- UserRepository
    BaseRepository~T~ <|-- ReportRepository
    BaseRepository~T~ <|-- TaskRepository
    BaseRepository~T~ <|-- FeedingPointRepository
    BaseRepository~T~ <|-- AnimalRepository
    BaseRepository~T~ <|-- VetRepository
    BaseRepository~T~ <|-- DonationRepository
    BaseRepository~T~ <|-- NotificationRepository

    %% ════════════════════════════════════════════════════════
    %% SERVICE → REPOSITORY DEPENDENCIES
    %% ════════════════════════════════════════════════════════

    AuthService --> UserRepository : uses
    UserService --> UserRepository : uses
    ReportService --> ReportRepository : uses
    ReportService --> AnimalRepository : uses
    ReportService --> NotificationRepository : uses
    TaskService --> TaskRepository : uses
    TaskService --> NotificationRepository : uses
    FeedingPointService --> FeedingPointRepository : uses
    VetService --> VetRepository : uses
    DonationService --> DonationRepository : uses

    %% ════════════════════════════════════════════════════════
    %% SERVICE → DTO DEPENDENCIES
    %% ════════════════════════════════════════════════════════

    AuthService ..> RegisterDto : validates
    AuthService ..> LoginDto : validates
    UserService ..> CreateUserDto : validates
    UserService ..> UpdateUserDto : validates
    ReportService ..> CreateReportDto : validates
    ReportService ..> UpdateReportStatusDto : validates
    TaskService ..> CreateTaskDto : validates
    TaskService ..> UpdateTaskStatusDto : validates
    FeedingPointService ..> CreateFeedingPointDto : validates
    FeedingPointService ..> RefillFeedingPointDto : validates
    VetService ..> UpdateVetAvailabilityDto : validates
    VetService ..> CreateVetCaseDto : validates
    VetService ..> UpdateVetCaseDto : validates
    DonationService ..> CreateDonationDto : validates
    DonationService ..> CreatePurchaseDto : validates

    %% ════════════════════════════════════════════════════════
    %% HELPER DEPENDENCIES
    %% ════════════════════════════════════════════════════════

    AuthService --> AuthHelper : uses
    AuthHelper --> JwtPayload : returns
    AuthHelper ..> ApiError : throws
    ApiResponse ..> ApiError : handles
```

## Katman Mimarisi (Layered Architecture)

```
┌─────────────────────────────────────────────────────┐
│                   Route Handlers                     │
│          (app/api/.../route.ts)                      │
│   ControllerHelper.handler() + validate() + auth     │
├─────────────────────────────────────────────────────┤
│                      DTOs                            │
│           (Zod validation schemas)                   │
│     RegisterDto, CreateReportDto, ...                │
├─────────────────────────────────────────────────────┤
│                    Services                          │
│          (Business Logic Layer)                      │
│  AuthService, UserService, ReportService, ...        │
├─────────────────────────────────────────────────────┤
│                  Repositories                        │
│           (Data Access Layer)                        │
│  BaseRepository → UserRepo, ReportRepo, ...          │
├─────────────────────────────────────────────────────┤
│                    Database                          │
│        MariaDB (mysql2/promise pool)                 │
│              13 tables                               │
└─────────────────────────────────────────────────────┘
```

## Kullanici Rolleri (User Roles)

| Rol | Yetkiler |
|-----|----------|
| **admin** | Kullanici yonetimi, satin alma, sistem ayarlari, raporlar/istatistikler |
| **advisor** | Dolum onayi, gorev atama, rapor onceliklendirme, gonullu takibi |
| **volunteer** | Yarali hayvan raporlama, besleme noktasi dolumu, gorev kabul/red, bagis |
| **vet** | Musaitlik ayari, vaka kabulu, teshis/tedavi girisi |
| **user** | Yarali hayvan raporlama, kendi rapor durumunu takip |
