/**
 * Tournament Shared Module
 * Supabase configuration and shared helpers for tournament pages.
 * Loaded by both tournaments.html (discovery) and tournament.html (detail).
 */

// =================================================================
// SUPABASE CONFIGURATION
// =================================================================
const SUPABASE_URL = 'https://puucaluhlwdfphsiznrx.supabase.co';
// TODO: Replace with your production anon key from Supabase Dashboard > Settings > API
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
const TOURNAMENT_LIVE_URL = `${SUPABASE_URL}/functions/v1/tournament-live`;

// Initialize Supabase client (requires supabase-js loaded via CDN)
const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// =================================================================
// FORMAT HELPERS
// =================================================================

/** Map format ID to display label */
function formatLabel(format) {
  const labels = {
    'single_elimination': 'Single Elimination',
    'double_elimination': 'Double Elimination',
    'swiss': 'Swiss',
    'round_robin': 'Round Robin'
  };
  return labels[format] || format || '';
}

/** Map stage ID to display name */
function formatStageName(stageId) {
  if (!stageId) return '';
  const names = {
    'swiss_rounds': 'Swiss Rounds',
    'swiss': 'Swiss Rounds',
    'semifinals': 'Semifinals',
    'finals': 'Finals',
    'top_cut': 'Top Cut',
    'single_elimination': 'Single Elimination',
    'double_elimination': 'Double Elimination',
    'round_robin': 'Round Robin',
    'consolation': 'Consolation'
  };
  if (names[stageId]) return names[stageId];
  // Fallback: convert snake_case to Title Case
  return stageId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// =================================================================
// FINISH TYPE HELPERS (from overlay.html)
// =================================================================

/**
 * Abbreviate finish type for display.
 * API sends short codes: S (spin), B (burst), O (over), X (extreme), R (ring out), L (launch error)
 */
function abbreviateFinish(finishType) {
  const type = (finishType || '').toUpperCase();
  if (type === 'S') return { abbr: 'SF', cls: 'spin' };
  if (type === 'B') return { abbr: 'BF', cls: 'burst' };
  if (type === 'O') return { abbr: 'OF', cls: 'over' };
  if (type === 'X') return { abbr: 'XF', cls: 'xtreme' };
  if (type === 'R') return { abbr: 'RO', cls: 'ring-out' };
  if (type === 'L') return { abbr: 'LE', cls: 'launch-error' };
  // Fallback: handle full names
  const lower = (finishType || '').toLowerCase();
  if (lower.includes('spin')) return { abbr: 'SF', cls: 'spin' };
  if (lower.includes('burst')) return { abbr: 'BF', cls: 'burst' };
  if (lower.includes('over')) return { abbr: 'OF', cls: 'over' };
  if (lower.includes('extreme') || lower.includes('xtreme')) return { abbr: 'XF', cls: 'xtreme' };
  if (lower.includes('ring')) return { abbr: 'RO', cls: 'ring-out' };
  if (lower.includes('launch')) return { abbr: 'LE', cls: 'launch-error' };
  return { abbr: '?', cls: '' };
}

/** Render score dots as HTML string */
function renderScoreDotsHTML(score, pointGoal) {
  let html = '';
  for (let i = 0; i < (pointGoal || 3); i++) {
    const filled = i < (score || 0) ? 'filled' : '';
    html += `<div class="score-dot ${filled}"></div>`;
  }
  return html;
}

/** Render win history as finish type tag HTML */
function renderWinHistoryHTML(history) {
  if (!history || !history.length) return '';
  return history.map(finish => {
    const { abbr, cls } = abbreviateFinish(finish);
    return `<span class="finish-tag ${cls}">${abbr}</span>`;
  }).join('');
}

// =================================================================
// TIME HELPERS
// =================================================================

/** Format a date string as relative time */
function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 0) return 'Just now';
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

/** Format a date string for display */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / 86400000);

  if (diffDays < 1) return 'Today';
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// =================================================================
// STAGE / FLOWCHART HELPERS
// =================================================================

/**
 * Parse tournament stages from progression_config or resolved_staging_snapshot.
 * Falls back to inferring from the format field.
 */
function parseStages(tournament) {
  if (!tournament) return [];

  // Try resolved_staging_snapshot first (frozen at tournament start)
  if (tournament.resolved_staging_snapshot) {
    const snapshot = typeof tournament.resolved_staging_snapshot === 'string'
      ? JSON.parse(tournament.resolved_staging_snapshot)
      : tournament.resolved_staging_snapshot;
    if (snapshot.stages && Array.isArray(snapshot.stages)) {
      return snapshot.stages.map(s => ({
        stageId: s.stageId || s.stage_id || s.id,
        displayName: s.displayName || s.display_name || formatStageName(s.stageId || s.stage_id || s.id),
        roundCount: s.roundCount || s.round_count || s.rounds || null,
        isAutoRoundCount: s.isAutoRoundCount || s.auto_rounds || false,
        advancementCount: s.advancementCount || s.advancement_count || null,
        isTerminal: s.isTerminal || s.is_terminal || false,
        order: s.order || 0
      })).sort((a, b) => a.order - b.order);
    }
  }

  // Try progression_config
  if (tournament.progression_config) {
    const config = typeof tournament.progression_config === 'string'
      ? JSON.parse(tournament.progression_config)
      : tournament.progression_config;
    if (config.stages && Array.isArray(config.stages)) {
      return config.stages.map(s => ({
        stageId: s.stageId || s.stage_id || s.id,
        displayName: s.displayName || s.display_name || formatStageName(s.stageId || s.stage_id || s.id),
        roundCount: s.roundCount || s.round_count || s.rounds || null,
        isAutoRoundCount: s.isAutoRoundCount || s.auto_rounds || false,
        advancementCount: s.advancementCount || s.advancement_count || null,
        isTerminal: s.isTerminal || s.is_terminal || false,
        order: s.order || 0
      })).sort((a, b) => a.order - b.order);
    }
  }

  // Fallback: infer from format
  const format = tournament.format || 'swiss';
  if (format === 'swiss') {
    const stages = [
      { stageId: 'swiss_rounds', displayName: 'Swiss Rounds', roundCount: tournament.resolved_swiss_rounds || tournament.current_round || null, order: 0 }
    ];
    if (tournament.finalist_count && tournament.finalist_count > 0) {
      stages.push({ stageId: 'finals', displayName: 'Finals', roundCount: null, order: 1, isTerminal: true });
    }
    return stages;
  }
  if (format === 'single_elimination') {
    return [{ stageId: 'single_elimination', displayName: 'Single Elimination', roundCount: null, order: 0, isTerminal: true }];
  }
  if (format === 'double_elimination') {
    return [{ stageId: 'double_elimination', displayName: 'Double Elimination', roundCount: null, order: 0, isTerminal: true }];
  }
  if (format === 'round_robin') {
    return [{ stageId: 'round_robin', displayName: 'Round Robin', roundCount: null, order: 0, isTerminal: true }];
  }

  return [{ stageId: format, displayName: formatStageName(format), roundCount: null, order: 0 }];
}

/**
 * Determine stage status relative to the current tournament stage.
 * @returns 'completed' | 'active' | 'pending'
 */
function getStageStatus(stageId, tournament, stagesArray) {
  if (!tournament || !stagesArray || stagesArray.length === 0) return 'pending';

  // If tournament is finished, all stages are completed
  if (tournament.finished_at) return 'completed';

  const currentStage = tournament.current_stage_id || tournament.stage || '';
  const stageIndex = stagesArray.findIndex(s => s.stageId === stageId);
  const currentIndex = stagesArray.findIndex(s => s.stageId === currentStage);

  if (currentIndex === -1) {
    // Can't determine — mark first as active, rest pending
    return stageIndex === 0 ? 'active' : 'pending';
  }

  if (stageIndex < currentIndex) return 'completed';
  if (stageIndex === currentIndex) return 'active';
  return 'pending';
}

// =================================================================
// MATCH DATA NORMALIZATION
// =================================================================

/**
 * Normalize a match from the edge function tables[] array (left_player/right_player format)
 * into a common shape for the match detail modal.
 */
function normalizeTableMatch(table) {
  return {
    id: table.match_id,
    round: table.round,
    tableNumber: table.table_number,
    status: table.status,
    pointGoal: table.point_goal || 3,
    judge: table.judge || null,
    leftPlayer: {
      id: table.left_player?.id,
      name: table.left_player?.name || 'TBD',
      color: table.left_player?.color || '#808080',
      combo: table.left_player?.combo || '',
      stadiumSide: table.left_player?.stadium_side,
      score: table.left_player?.score || 0,
      winHistory: table.left_player?.win_history || [],
      isWinner: table.left_player?.is_winner === true
    },
    rightPlayer: {
      id: table.right_player?.id,
      name: table.right_player?.name || 'TBD',
      color: table.right_player?.color || '#808080',
      combo: table.right_player?.combo || '',
      stadiumSide: table.right_player?.stadium_side,
      score: table.right_player?.score || 0,
      winHistory: table.right_player?.win_history || [],
      isWinner: table.right_player?.is_winner === true
    }
  };
}

/**
 * Normalize a match from the edge function all_matches[] array (player1/player2 or red/blue format)
 * into a common shape for the match detail modal.
 */
function normalizeAllMatch(match, pointGoal) {
  // Prefer red/blue columns if available
  const useRedBlue = match.red_player_id || match.red_player_name;

  return {
    id: match.id,
    round: match.round,
    tableNumber: match.table_number || null,
    status: match.status,
    pointGoal: pointGoal || 3,
    matchType: match.match_type || null,
    judge: match.assigned_judge_name || null,
    leftPlayer: {
      id: useRedBlue ? match.red_player_id : match.player1_id,
      name: useRedBlue ? (match.red_player_name || 'TBD') : (match.player1_name || 'TBD'),
      color: '#808080',
      combo: useRedBlue ? (match.red_current_combo || '') : (match.player1_current_combo || ''),
      stadiumSide: null,
      score: useRedBlue ? (match.red_score || 0) : (match.player1_score || 0),
      winHistory: useRedBlue ? (match.red_win_history || []) : [],
      isWinner: useRedBlue
        ? match.winner_side === 'red'
        : match.winner_id === match.player1_id
    },
    rightPlayer: {
      id: useRedBlue ? match.blue_player_id : match.player2_id,
      name: useRedBlue ? (match.blue_player_name || 'TBD') : (match.player2_name || 'TBD'),
      color: '#808080',
      combo: useRedBlue ? (match.blue_current_combo || '') : (match.player2_current_combo || ''),
      stadiumSide: null,
      score: useRedBlue ? (match.blue_score || 0) : (match.player2_score || 0),
      winHistory: useRedBlue ? (match.blue_win_history || []) : [],
      isWinner: useRedBlue
        ? match.winner_side === 'blue'
        : match.winner_id === match.player2_id
    }
  };
}
