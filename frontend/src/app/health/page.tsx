"use client";

import { useFetch, useMutation } from '@/hooks/useApi';
import { useSidebar } from '@/context/SidebarContext';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import TrialGuard from '@/components/TrialGuard';
import Link from 'next/link';

interface NutritionSummary {
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFats?: number;
}

interface Workout {
  id: string;
  name: string;
  workoutDate: string;
  durationMinutes: number;
}

interface Nutrition {
  id: string;
  logDate: string;
  mealName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export default function HealthDashboard() {
  const { isCollapsed } = useSidebar();
  const currentDate = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const { data: nutritionSummary, loading: nutritionLoading, refetch: refetchNutritionSum } = useFetch<NutritionSummary>(
    `/health/nutrition/summary?date=${selectedDate}`
  );

  const { data: workouts, loading: workoutsLoading, refetch: refetchWorkouts } = useFetch<Workout[]>(`/health/workouts?date=${selectedDate}`);
  const { data: nutritionLogs, loading: nutritionLogsLoading, refetch: refetchNutritionLogs } = useFetch<Nutrition[]>(`/health/nutrition?date=${selectedDate}`);

  const refetchAllNutrition = () => { refetchNutritionSum(); refetchNutritionLogs(); };

  const { mutate: createWorkout, loading: creatingWorkout } = useMutation('/health/workouts', 'POST');
  const { mutate: updateWorkoutMutation, loading: updatingWorkout } = useMutation('/health/workouts', 'PUT');
  const { mutate: deleteWorkoutMutation, loading: deletingWorkout } = useMutation('/health/workouts', 'DELETE');

  const { mutate: logNutrition, loading: loggingNutrition } = useMutation('/health/nutrition', 'POST');
  const { mutate: updateNutritionMutation, loading: updatingNutrition } = useMutation('/health/nutrition', 'PUT');
  const { mutate: deleteNutritionMutation, loading: deletingNutrition } = useMutation('/health/nutrition', 'DELETE');

  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingNutritionId, setEditingNutritionId] = useState<string | null>(null);

  const [workoutForm, setWorkoutForm] = useState({
    name: '',
    date: currentDate,
    durationMinutes: 0
  });

  const [nutritionForm, setNutritionForm] = useState({
    date: currentDate,
    mealName: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutForm.name || workoutForm.durationMinutes <= 0) return;

    const payload = {
      name: workoutForm.name,
      date: workoutForm.date,
      durationMinutes: workoutForm.durationMinutes
    };

    if (editingWorkoutId) {
      await updateWorkoutMutation(payload, `/health/workouts/${editingWorkoutId}`);
      setEditingWorkoutId(null);
    } else {
      await createWorkout(payload);
    }
    setWorkoutForm({ name: '', date: currentDate, durationMinutes: 0 });
    refetchWorkouts();
  };

  const handleEditWorkout = (workout: Workout) => {
    setEditingWorkoutId(workout.id);
    setWorkoutForm({
      name: workout.name,
      date: workout.workoutDate,
      durationMinutes: workout.durationMinutes
    });
  };

  const handleDeleteWorkout = async (id: string) => {
    if (confirm('Delete this workout?')) {
      await deleteWorkoutMutation(null, `/health/workouts/${id}`);
      refetchWorkouts();
    }
  };

  const handleNutritionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nutritionForm.mealName || nutritionForm.calories <= 0) return;

    const payload = {
      date: nutritionForm.date,
      mealName: nutritionForm.mealName,
      calories: nutritionForm.calories,
      protein: nutritionForm.protein,
      carbs: nutritionForm.carbs,
      fats: nutritionForm.fats
    };

    if (editingNutritionId) {
      await updateNutritionMutation(payload, `/health/nutrition/${editingNutritionId}`);
      setEditingNutritionId(null);
    } else {
      await logNutrition(payload);
    }

    refetchAllNutrition();
    setNutritionForm({
      date: currentDate,
      mealName: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    });
  };

  const handleEditNutrition = (nutrition: Nutrition) => {
    setEditingNutritionId(nutrition.id);
    setNutritionForm({
      date: nutrition.logDate,
      mealName: nutrition.mealName,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fats: nutrition.fats
    });
  };

  const handleDeleteNutrition = async (id: string) => {
    if (confirm('Delete this meal?')) {
      await deleteNutritionMutation(null, `/health/nutrition/${id}`);
      refetchAllNutrition();
    }
  };
return (
  <TrialGuard>
    <div className="min-h-screen bg-background text-on-background">
      <Sidebar />

      <main className={`ml-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} transition-all duration-300 p-8 md:p-margin-desktop`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline-xl text-primary">Health & Vitality</h1>
          <Link 
            href="/history?tab=health" 
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full transition-all font-label-caps border border-outline-variant shadow-sm group"
          >
            <span className="material-symbols-outlined text-[18px] text-primary group-hover:rotate-12 transition-transform">history</span>
            <span>Analytics & History</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Log Workout */}
          <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant flex flex-col justify-between">
            <div>
              <h2 className="font-headline-md text-primary mb-4">{editingWorkoutId ? 'Edit Workout' : 'Log Workout Session'}</h2>
              <form onSubmit={handleWorkoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Workout Name</label>
                  <input
                    type="text"
                    value={workoutForm.name}
                    onChange={e => setWorkoutForm({ ...workoutForm, name: e.target.value })}
                    required
                    className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                    placeholder="e.g. Upper Body Push, Cardio, Yoga"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={workoutForm.date}
                      onChange={e => setWorkoutForm({ ...workoutForm, date: e.target.value })}
                      required
                      className="w-full bg-surface-container px-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Duration (mins)</label>
                    <input
                      type="number"
                      value={workoutForm.durationMinutes || ''}
                      onChange={e => setWorkoutForm({ ...workoutForm, durationMinutes: parseInt(e.target.value) || 0 })}
                      required
                      className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-data-display"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={creatingWorkout || updatingWorkout}
                    className="flex-1 bg-primary text-on-primary font-bold py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {creatingWorkout || updatingWorkout ? 'Saving...' : editingWorkoutId ? 'Update' : 'Save'}
                  </button>
                  {editingWorkoutId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingWorkoutId(null);
                        setWorkoutForm({ name: '', date: currentDate, durationMinutes: 0 });
                      }}
                      className="px-4 bg-surface-container-high text-on-surface font-bold py-2 rounded hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Workouts List */}
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <h3 className="font-headline-sm text-primary mb-4">Workouts on {selectedDate}</h3>
              {workoutsLoading ? (
                <div className="h-16 bg-surface-container animate-pulse rounded-lg"></div>
              ) : workouts && workouts.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {workouts.map(w => (
                    <div key={w.id} className="p-3 bg-surface-container rounded-lg border border-outline-variant flex justify-between items-center group">
                      <div>
                        <div className="font-bold text-on-surface">{w.name}</div>
                        <div className="text-xs text-outline">{w.durationMinutes} mins</div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditWorkout(w)} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-high">edit</button>
                        <button onClick={() => handleDeleteWorkout(w.id)} disabled={deletingWorkout} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container-high">delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-outline text-sm">No workouts logged.</p>
              )}
            </div>
          </section>

          {/* Log Nutrition */}
          <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant flex flex-col justify-between">
            <div>
              <h2 className="font-headline-md text-primary mb-4">{editingNutritionId ? 'Edit Meal' : 'Log Nutrition'}</h2>
              <form onSubmit={handleNutritionSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Meal Name</label>
                    <input
                      type="text"
                      value={nutritionForm.mealName}
                      onChange={e => setNutritionForm({ ...nutritionForm, mealName: e.target.value })}
                      required
                      className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                      placeholder="e.g. Protein Shake, Chicken Salad, Eggs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={nutritionForm.date}
                        onChange={e => setNutritionForm({ ...nutritionForm, date: e.target.value })}
                        required
                        className="w-full bg-surface-container px-3 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono text-sm appearance-none [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Calories (kcal)</label>
                    <input
                      type="number"
                      value={nutritionForm.calories || ''}
                      onChange={e => setNutritionForm({ ...nutritionForm, calories: parseInt(e.target.value) || 0 })}
                      required
                      className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-data-display"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Protein (g)</label>
                    <input
                      type="number"
                      value={nutritionForm.protein || ''}
                      onChange={e => setNutritionForm({ ...nutritionForm, protein: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-data-display"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Carbs (g)</label>
                    <input
                      type="number"
                      value={nutritionForm.carbs || ''}
                      onChange={e => setNutritionForm({ ...nutritionForm, carbs: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-data-display"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-caps text-outline mb-1 uppercase tracking-wider">Fats (g)</label>
                    <input
                      type="number"
                      value={nutritionForm.fats || ''}
                      onChange={e => setNutritionForm({ ...nutritionForm, fats: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-surface-container px-4 py-3 border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-data-display"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loggingNutrition || updatingNutrition}
                    className="flex-1 bg-primary text-on-primary font-bold py-2 rounded hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {loggingNutrition || updatingNutrition ? 'Saving...' : editingNutritionId ? 'Update' : 'Save'}
                  </button>
                  {editingNutritionId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNutritionId(null);
                        setNutritionForm({ date: currentDate, mealName: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                      }}
                      className="px-4 bg-surface-container-high text-on-surface font-bold py-2 rounded hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Meals List */}
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <h3 className="font-headline-sm text-primary mb-4">Meals on {selectedDate}</h3>
              {nutritionLogsLoading ? (
                <div className="h-16 bg-surface-container animate-pulse rounded-lg"></div>
              ) : nutritionLogs && nutritionLogs.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {nutritionLogs.map(n => (
                    <div key={n.id} className="p-3 bg-surface-container rounded-lg border border-outline-variant flex justify-between items-center group">
                      <div>
                        <div className="font-bold text-on-surface">{n.mealName}</div>
                        <div className="text-xs text-outline">{n.calories} kcal • P:{n.protein} C:{n.carbs} F:{n.fats}</div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditNutrition(n)} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-primary rounded hover:bg-surface-container-high">edit</button>
                        <button onClick={() => handleDeleteNutrition(n.id)} disabled={deletingNutrition} className="material-symbols-outlined text-sm p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container-high">delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-outline text-sm">No meals logged.</p>
              )}
            </div>

            {/* Daily Nutrition Summary */}
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-sm text-primary">Daily Summary</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="bg-surface-container text-xs p-1 rounded border border-outline-variant text-on-surface focus:outline-none"
                />
              </div>
              {nutritionLoading ? (
                <div className="h-16 bg-surface-container animate-pulse rounded-lg"></div>
              ) : (
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-surface-container p-2 rounded border border-outline-variant">
                    <div className="text-[10px] font-label-caps text-outline">CALORIES</div>
                    <div className="text-lg font-bold text-on-surface">{nutritionSummary?.totalCalories || 0} kcal</div>
                  </div>
                  <div className="bg-surface-container p-2 rounded border border-outline-variant">
                    <div className="text-[10px] font-label-caps text-outline">PROTEIN</div>
                    <div className="text-lg font-bold text-on-surface">{nutritionSummary?.totalProtein || 0}g</div>
                  </div>
                  <div className="bg-surface-container p-2 rounded border border-outline-variant">
                    <div className="text-[10px] font-label-caps text-outline">CARBS</div>
                    <div className="text-lg font-bold text-on-surface">{nutritionSummary?.totalCarbs || 0}g</div>
                  </div>
                  <div className="bg-surface-container p-2 rounded border border-outline-variant">
                    <div className="text-[10px] font-label-caps text-outline">FATS</div>
                    <div className="text-lg font-bold text-on-surface">{nutritionSummary?.totalFats || 0}g</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  </TrialGuard>
);
}
