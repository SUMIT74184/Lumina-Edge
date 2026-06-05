-- Add user_id column to all entity tables for multi-tenancy

-- 1. Add column to finance_transactions
ALTER TABLE finance_transactions ADD COLUMN user_id VARCHAR(255) DEFAULT 'system_user';
UPDATE finance_transactions SET user_id = 'system_user' WHERE user_id IS NULL;
ALTER TABLE finance_transactions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE finance_transactions ALTER COLUMN user_id DROP DEFAULT;

-- 2. Add column to time_events
ALTER TABLE time_events ADD COLUMN user_id VARCHAR(255) DEFAULT 'system_user';
UPDATE time_events SET user_id = 'system_user' WHERE user_id IS NULL;
ALTER TABLE time_events ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE time_events ALTER COLUMN user_id DROP DEFAULT;

-- 3. Add column to health_workouts
ALTER TABLE health_workouts ADD COLUMN user_id VARCHAR(255) DEFAULT 'system_user';
UPDATE health_workouts SET user_id = 'system_user' WHERE user_id IS NULL;
ALTER TABLE health_workouts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE health_workouts ALTER COLUMN user_id DROP DEFAULT;

-- 4. Add column to health_exercises
ALTER TABLE health_exercises ADD COLUMN user_id VARCHAR(255) DEFAULT 'system_user';
UPDATE health_exercises SET user_id = 'system_user' WHERE user_id IS NULL;
ALTER TABLE health_exercises ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE health_exercises ALTER COLUMN user_id DROP DEFAULT;

-- 5. Add column to health_nutrition
ALTER TABLE health_nutrition ADD COLUMN user_id VARCHAR(255) DEFAULT 'system_user';
UPDATE health_nutrition SET user_id = 'system_user' WHERE user_id IS NULL;
ALTER TABLE health_nutrition ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE health_nutrition ALTER COLUMN user_id DROP DEFAULT;

-- Add indexes for better query performance on user_id
CREATE INDEX idx_finance_user_id ON finance_transactions(user_id);
CREATE INDEX idx_time_user_id ON time_events(user_id);
CREATE INDEX idx_workout_user_id ON health_workouts(user_id);
CREATE INDEX idx_exercise_user_id ON health_exercises(user_id);
CREATE INDEX idx_nutrition_user_id ON health_nutrition(user_id);
