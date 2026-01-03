import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { auth } from '@/config/firebase';

/**
 * Firestore service for expenses
 */
export const expensesService = {
  /**
   * Get all expenses for current user
   */
  async getAll() {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated. Please log in first.');
      }

      console.log('[Firestore] Fetching expenses for user:', auth.currentUser.uid);

      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to JS dates
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }));

      console.log(`[Firestore] ✅ Fetched ${expenses.length} expenses`);
      return expenses;
    } catch (error) {
      console.error('[Firestore] ❌ Error fetching expenses:', {
        code: error.code,
        message: error.message,
      });
      throw error;
    }
  },

  /**
   * Get single expense by ID
   */
  async getById(id) {
    try {
      const docRef = doc(db, 'expenses', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Expense not found');
      }

      const data = docSnap.data();
      if (data.userId !== auth.currentUser?.uid) {
        throw new Error('Unauthorized');
      }

      return {
        id: docSnap.id,
        ...data,
        date: data.date?.toDate?.() || new Date(data.date),
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  /**
   * Create new expense
   */
  async create(expenseData) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated. Please log in first.');
      }

      const { amount, category, description, date, type, groupId } = expenseData;

      // Validate input
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!category || !description) {
        throw new Error('Missing required fields: category and description');
      }
      if (!date) {
        throw new Error('Date is required');
      }

      console.log('[Firestore] Creating expense for user:', auth.currentUser.uid);

      const expenseDoc = {
        userId: auth.currentUser.uid,
        amount: parseFloat(amount),
        category: category.toLowerCase(),
        description: String(description).trim(),
        date: new Date(date),
        type: type || 'private',
        groupId: groupId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('[Firestore] Expense document:', expenseDoc);

      // Add timeout to prevent hanging
      const createPromise = addDoc(collection(db, 'expenses'), expenseDoc);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore write timeout - check network and security rules')), 10000)
      );

      const docRef = await Promise.race([createPromise, timeoutPromise]);

      console.log('[Firestore] ✅ Expense created with ID:', docRef.id);

      return {
        id: docRef.id,
        userId: auth.currentUser.uid,
        amount: parseFloat(amount),
        category: category.toLowerCase(),
        description: String(description).trim(),
        date: new Date(date),
        type: type || 'private',
        groupId: groupId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('[Firestore] ❌ Error creating expense:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  },

  /**
   * Update expense
   */
  async update(id, updates) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const docRef = doc(db, 'expenses', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Expense not found');
      }

      const data = docSnap.data();
      if (data.userId !== auth.currentUser.uid) {
        throw new Error('Unauthorized');
      }

      // Sanitize updates
      const sanitized = {};
      if (updates.amount !== undefined) {
        const amount = parseFloat(updates.amount);
        if (amount <= 0) throw new Error('Amount must be greater than 0');
        sanitized.amount = amount;
      }
      if (updates.category) sanitized.category = updates.category.toLowerCase();
      if (updates.description) sanitized.description = updates.description;
      if (updates.date) sanitized.date = new Date(updates.date);
      if (updates.type) sanitized.type = updates.type;
      if (updates.groupId) sanitized.groupId = updates.groupId;

      sanitized.updatedAt = serverTimestamp();

      await updateDoc(docRef, sanitized);

      // Fetch and return updated doc
      const updated = await getDoc(docRef);
      return {
        id: updated.id,
        ...updated.data(),
        date: updated.data().date?.toDate?.() || new Date(updated.data().date),
        createdAt: updated.data().createdAt?.toDate?.() || updated.data().createdAt,
        updatedAt: updated.data().updatedAt?.toDate?.() || updated.data().updatedAt,
      };
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  /**
   * Delete expense
   */
  async delete(id) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const docRef = doc(db, 'expenses', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Expense not found');
      }

      const data = docSnap.data();
      if (data.userId !== auth.currentUser.uid) {
        throw new Error('Unauthorized');
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  /**
    * Get expenses by category
    */
  async getByCategory(category) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', auth.currentUser.uid),
        where('category', '==', category.toLowerCase()),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw error;
    }
  },

  /**
    * Get expenses by date range
    */
  async getByDateRange(startDate, endDate) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const q = query(
        collection(db, 'expenses'),
        where('userId', '==', auth.currentUser.uid),
        where('date', '>=', new Date(startDate)),
        where('date', '<=', new Date(endDate)),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching expenses by date range:', error);
      throw error;
    }
  },

  /**
    * Search and filter expenses
    * @param {Object} filters - Filter options
    * @param {string} filters.searchQuery - Search in description and category
    * @param {string} filters.category - Filter by category
    * @param {string} filters.fromDate - Start date (YYYY-MM-DD)
    * @param {string} filters.toDate - End date (YYYY-MM-DD)
    */
  async searchAndFilter(filters = {}) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const { searchQuery = '', category = '', fromDate = '', toDate = '' } = filters;

      // Build query with base conditions
      const constraints = [
        where('userId', '==', auth.currentUser.uid),
      ];

      // Add category filter if provided
      if (category) {
        constraints.push(where('category', '==', category.toLowerCase()));
      }

      // Add date range filters if provided
      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        constraints.push(where('date', '>=', from));
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        constraints.push(where('date', '<=', to));
      }

      constraints.push(orderBy('date', 'desc'));

      const q = query(
        collection(db, 'expenses'),
        ...constraints
      );

      const snapshot = await getDocs(q);
      let expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }));

      // Client-side search filtering (for description and category keywords)
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        expenses = expenses.filter(e =>
          e.description.toLowerCase().includes(lowerQuery) ||
          e.category.toLowerCase().includes(lowerQuery)
        );
      }

      return expenses;
    } catch (error) {
      console.error('Error searching and filtering expenses:', error);
      throw error;
    }
  },

  /**
    * Get paginated expenses with filters
    * @param {Object} options - Pagination and filter options
    * @param {number} options.page - Page number (1-based)
    * @param {number} options.limit - Items per page (default: 10)
    * @param {string} options.searchQuery - Search in description and category
    * @param {string} options.category - Filter by category
    * @param {string} options.fromDate - Start date (YYYY-MM-DD)
    * @param {string} options.toDate - End date (YYYY-MM-DD)
    * @returns {Object} { expenses: [], total: number, page: number, limit: number, totalPages: number }
    */
  async getPaginated(options = {}) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const {
        page = 1,
        limit = 10,
        searchQuery = '',
        category = '',
        fromDate = '',
        toDate = '',
      } = options;

      // Build query with base conditions
      const constraints = [
        where('userId', '==', auth.currentUser.uid),
      ];

      // Add category filter if provided
      if (category) {
        constraints.push(where('category', '==', category.toLowerCase()));
      }

      // Add date range filters if provided
      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        constraints.push(where('date', '>=', from));
      }

      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        constraints.push(where('date', '<=', to));
      }

      constraints.push(orderBy('date', 'desc'));

      const q = query(
        collection(db, 'expenses'),
        ...constraints
      );

      const snapshot = await getDocs(q);
      let expenses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate?.() || new Date(doc.data().date),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }));

      // Client-side search filtering (for description and category keywords)
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        expenses = expenses.filter(e =>
          e.description.toLowerCase().includes(lowerQuery) ||
          e.category.toLowerCase().includes(lowerQuery)
        );
      }

      // Calculate pagination
      const total = expenses.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedExpenses = expenses.slice(startIndex, endIndex);

      console.log(`[Firestore] Fetched page ${page} of ${totalPages} (${total} total expenses)`);

      return {
        expenses: paginatedExpenses,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      console.error('Error fetching paginated expenses:', error);
      throw error;
    }
  },
};

/**
 * Analytics service for dashboard
 */
export const analyticsService = {
  /**
   * Get monthly spending total
   */
  async getMonthlyTotal(expenses) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  },

  /**
   * Get spending by category
   */
  async getCategoryBreakdown(expenses) {
    const totals = {
      food: 0,
      transport: 0,
      shopping: 0,
      entertainment: 0,
      bills: 0,
      healthcare: 0,
      education: 0,
      travel: 0,
      other: 0,
    };

    expenses.forEach(expense => {
      if (totals.hasOwnProperty(expense.category)) {
        totals[expense.category] += expense.amount;
      }
    });

    return totals;
  },

  /**
   * Get spending trend for last 6 months
   */
  async getMonthlyTrend(expenses) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trend = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      const monthTotal = expenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

      trend.push({
        month: months[monthIndex],
        amount: monthTotal,
      });
    }

    return trend;
  },

  /**
   * Get spending for current week
   */
  async getWeeklyTotal(expenses) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return expenses
      .filter(e => new Date(e.date) >= startOfWeek)
      .reduce((sum, e) => sum + e.amount, 0);
  },

  /**
   * Get average expense per transaction
   */
  async getAverageExpense(expenses) {
    return expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length : 0;
  },

  /**
   * Get recent transactions
   */
  async getRecentTransactions(expenses, limit = 5) {
    return expenses
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },

  /**
   * Get largest expenses
   */
  async getLargestExpenses(expenses, limit = 10) {
    return expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  },

  /**
   * Get spending comparison with previous month
   */
  async getMonthlyComparison(expenses) {
    const now = new Date();
    
    // Current month
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthTotal = expenses
      .filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    // Previous month
    const prevDate = new Date(now);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevMonth = prevDate.getMonth();
    const prevYear = prevDate.getFullYear();
    const prevMonthTotal = expenses
      .filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const percentChange = prevMonthTotal > 0
      ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal * 100).toFixed(1)
      : 0;

    return {
      currentMonth: currentMonthTotal,
      previousMonth: prevMonthTotal,
      percentChange: percentChange,
      isPositive: currentMonthTotal < prevMonthTotal,
    };
  },
};

/**
 * Firestore service for groups
 */
export const groupsService = {
  /**
   * Get all groups for current user
   */
  async getAll() {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const q = query(
        collection(db, 'groups'),
        where('members', 'array-contains', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  /**
   * Create new group
   */
  async create(groupData) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const { name, description, members } = groupData;

      if (!name) {
        throw new Error('Group name is required');
      }

      const docRef = await addDoc(collection(db, 'groups'), {
        name,
        description: description || '',
        createdBy: auth.currentUser.uid,
        members: [auth.currentUser.uid, ...(members || [])],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        name,
        description: description || '',
        createdBy: auth.currentUser.uid,
        members: [auth.currentUser.uid, ...(members || [])],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  /**
   * Update group
   */
  async update(id, updates) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const docRef = doc(db, 'groups', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Group not found');
      }

      if (docSnap.data().createdBy !== auth.currentUser.uid) {
        throw new Error('Only group creator can update');
      }

      const sanitized = { updatedAt: serverTimestamp() };
      if (updates.name) sanitized.name = updates.name;
      if (updates.description !== undefined) sanitized.description = updates.description;
      if (updates.members) sanitized.members = updates.members;

      await updateDoc(docRef, sanitized);

      const updated = await getDoc(docRef);
      return {
        id: updated.id,
        ...updated.data(),
        createdAt: updated.data().createdAt?.toDate?.() || updated.data().createdAt,
        updatedAt: updated.data().updatedAt?.toDate?.() || updated.data().updatedAt,
      };
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  /**
   * Delete group
   */
  async delete(id) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const docRef = doc(db, 'groups', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Group not found');
      }

      if (docSnap.data().createdBy !== auth.currentUser.uid) {
        throw new Error('Only group creator can delete');
      }

      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  /**
   * Add member to group
   */
  async addMember(groupId, userId) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const docRef = doc(db, 'groups', groupId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Group not found');
      }

      if (docSnap.data().createdBy !== auth.currentUser.uid) {
        throw new Error('Only group creator can add members');
      }

      const members = docSnap.data().members || [];
      if (!members.includes(userId)) {
        members.push(userId);
        await updateDoc(docRef, { members, updatedAt: serverTimestamp() });
      }
    } catch (error) {
      console.error('Error adding member to group:', error);
      throw error;
    }
  },

  /**
   * Remove member from group
   */
  async removeMember(groupId, userId) {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const docRef = doc(db, 'groups', groupId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Group not found');
      }

      if (docSnap.data().createdBy !== auth.currentUser.uid) {
        throw new Error('Only group creator can remove members');
      }

      const members = docSnap.data().members || [];
      const updated = members.filter(m => m !== userId);
      await updateDoc(docRef, { members: updated, updatedAt: serverTimestamp() });
    } catch (error) {
      console.error('Error removing member from group:', error);
      throw error;
    }
  },
};
