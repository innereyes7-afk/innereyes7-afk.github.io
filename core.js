"use strict";
var BA = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/android-core.ts
  var android_core_exports = {};
  __export(android_core_exports, {
    CONSTITUTION: () => CONSTITUTION,
    DEFAULT_KEEPER_PASSWORD: () => DEFAULT_KEEPER_PASSWORD,
    DEFAULT_SETTINGS: () => DEFAULT_SETTINGS,
    EXPENSE_CATEGORIES: () => EXPENSE_CATEGORIES,
    KSA_PARTNERS: () => KSA_PARTNERS,
    MEMBERS: () => MEMBERS,
    MEMBER_MAP: () => MEMBER_MAP,
    PROJECT_KINDS: () => PROJECT_KINDS,
    SEED_TRANSACTIONS: () => SEED_TRANSACTIONS,
    buildMemberAccount: () => buildMemberAccount,
    computeSnapshot: () => computeSnapshot,
    kindLabel: () => kindLabel,
    memberProjectSharePkr: () => memberProjectSharePkr,
    typeLabel: () => typeLabel
  });

  // src/lib/members.ts
  var MEMBERS = [
    {
      id: "ishtiaq",
      name: "Muhammad Ishtiaq",
      short: "Ishtiaq",
      role: "ksa",
      title: "Emergency authority",
      profitShare: 17.8,
      lossShare: 20,
      investmentTargetSar: 4e4,
      emergencyTargetSar: 6e3,
      salaryPkr: 0,
      initials: "MI"
    },
    {
      id: "inam",
      name: "Inam Ur Rehman",
      short: "Inam",
      role: "ksa",
      title: "KSA partner",
      profitShare: 17.8,
      lossShare: 20,
      investmentTargetSar: 4e4,
      emergencyTargetSar: 6e3,
      salaryPkr: 0,
      initials: "IR"
    },
    {
      id: "abdullah",
      name: "Abdullah",
      short: "Abdullah",
      role: "ksa",
      title: "KSA partner",
      profitShare: 17.8,
      lossShare: 20,
      investmentTargetSar: 4e4,
      emergencyTargetSar: 6e3,
      salaryPkr: 0,
      initials: "AB"
    },
    {
      id: "asim",
      name: "Muhammad Asim",
      short: "Asim",
      role: "ksa",
      title: "KSA partner",
      profitShare: 17.8,
      lossShare: 20,
      investmentTargetSar: 4e4,
      emergencyTargetSar: 6e3,
      salaryPkr: 0,
      initials: "MA"
    },
    {
      id: "afaq",
      name: "Afaq Khan",
      short: "Afaq",
      role: "ksa",
      title: "KSA partner",
      profitShare: 17.8,
      lossShare: 20,
      investmentTargetSar: 4e4,
      emergencyTargetSar: 6e3,
      salaryPkr: 0,
      initials: "AK"
    },
    {
      id: "amad",
      name: "Muhammad Amad Khan",
      short: "Amad",
      role: "operator",
      title: "Pakistan operator",
      profitShare: 10,
      lossShare: 0,
      investmentTargetSar: 0,
      emergencyTargetSar: 0,
      salaryPkr: 15e3,
      initials: "AM"
    },
    {
      id: "allah",
      name: "Allah's Path",
      short: "Sadaqah",
      role: "sadaqah",
      title: "1% annually, path of Allah",
      profitShare: 1,
      lossShare: 0,
      investmentTargetSar: 0,
      emergencyTargetSar: 0,
      salaryPkr: 0,
      initials: "AP"
    }
  ];
  var MEMBER_MAP = Object.fromEntries(MEMBERS.map((m) => [m.id, m]));
  var KSA_PARTNERS = MEMBERS.filter((m) => m.role === "ksa");
  var WORKING_MEMBERS = MEMBERS.filter((m) => m.role !== "sadaqah");

  // src/lib/compute.ts
  function emptyMember(id, settings, member = MEMBERS.find((m) => m.id === id)) {
    const invTarget = member?.investmentTargetSar ?? settings.investmentTargetSar;
    const emTarget = member?.emergencyTargetSar ?? 0;
    return {
      id,
      investmentSar: 0,
      emergencySar: 0,
      lifetimeEmergencySar: 0,
      lifetimeInvestmentSar: 0,
      lifetimeContributedSar: 0,
      lifetimeContributedPkr: 0,
      capitalBookPkr: 0,
      allocatedPkr: 0,
      individualProfitPkr: 0,
      individualLossPkr: 0,
      unrealisedPkr: 0,
      realisedPkr: 0,
      withdrawnPkr: 0,
      capitalizedProfitPkr: 0,
      availableProfitPkr: 0,
      projectProfitPkr: 0,
      salaryReceivedPkr: 0,
      loanOutstandingSar: 0,
      loanBorrowedSar: 0,
      loanRepaidSar: 0,
      investmentRemainingSar: invTarget,
      emergencyRemainingSar: emTarget,
      deployedSharePkr: 0,
      investablePkr: 0,
      ownershipPct: 0,
      targetsComplete: invTarget <= 0 && emTarget <= 0,
      canWithdrawProfit: false,
      canMoveToInvestment: false,
      netPositionPkr: 0
    };
  }
  function computeSnapshot(transactions, settings, projects = []) {
    const members = {};
    for (const m of MEMBERS) members[m.id] = emptyMember(m.id, settings, m);
    let ksaSar = 0;
    let pkPkr = 0;
    let poolInv = 0;
    let poolEm = 0;
    let revenuePkr = 0;
    let revenueSar = 0;
    let expensesPkr = 0;
    const monthlyMap = /* @__PURE__ */ new Map();
    const monthOf = (date) => {
      const key = date.slice(0, 7);
      let row = monthlyMap.get(key);
      if (!row) {
        row = { month: key, contributionsPkr: 0, expensesPkr: 0, revenuePkr: 0, fxInPkr: 0 };
        monthlyMap.set(key, row);
      }
      return row;
    };
    const sorted = [...transactions].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.id.localeCompare(b.id);
    });
    for (const t of sorted) {
      const m = t.memberId ? members[t.memberId] : void 0;
      const month = monthOf(t.date);
      switch (t.type) {
        case "contribution": {
          if (m) {
            m.lifetimeContributedSar += t.amountSar;
            m.lifetimeContributedPkr += t.amountPkr;
            if (t.fund === "emergency") {
              m.emergencySar += t.amountSar;
              m.lifetimeEmergencySar += t.amountSar;
              poolEm += t.amountSar;
            } else {
              m.investmentSar += t.amountSar;
              m.lifetimeInvestmentSar += t.amountSar;
              poolInv += t.amountSar;
            }
          }
          if (t.bank === "ksa") ksaSar += t.amountSar;
          if (t.bank === "pk") pkPkr += t.amountPkr;
          month.contributionsPkr += Math.abs(t.amountPkr);
          break;
        }
        case "fund_transfer": {
          const amt = Math.abs(t.amountSar);
          if (m) {
            if (t.fund === "investment") {
              m.emergencySar -= amt;
              m.investmentSar += amt;
              poolEm -= amt;
              poolInv += amt;
            } else {
              m.investmentSar -= amt;
              m.emergencySar += amt;
              poolInv -= amt;
              poolEm += amt;
            }
          } else if (t.fund === "emergency") {
            poolInv -= amt;
            poolEm += amt;
          } else {
            poolEm -= amt;
            poolInv += amt;
          }
          break;
        }
        case "fx_transfer": {
          ksaSar += t.amountSar;
          pkPkr += t.amountPkr;
          month.fxInPkr += Math.max(0, t.amountPkr);
          break;
        }
        case "expense": {
          if (t.bank === "pk") pkPkr += t.amountPkr;
          if (t.bank === "ksa") ksaSar += t.amountSar;
          expensesPkr += Math.abs(t.amountPkr);
          poolInv += t.amountSar;
          if (m && t.category === "Salary") m.salaryReceivedPkr += Math.abs(t.amountPkr);
          month.expensesPkr += Math.abs(t.amountPkr);
          break;
        }
        case "revenue": {
          if (t.bank === "ksa") ksaSar += t.amountSar;
          if (t.bank === "pk") pkPkr += t.amountPkr;
          revenuePkr += t.amountPkr;
          revenueSar += t.amountSar;
          poolInv += t.amountSar;
          month.revenuePkr += t.amountPkr;
          break;
        }
        case "deploy": {
          if (t.bank === "pk") pkPkr += t.amountPkr;
          if (t.bank === "ksa") ksaSar += t.amountSar;
          poolInv += t.amountSar;
          break;
        }
        case "loan": {
          const amt = Math.abs(t.amountSar);
          if (m) {
            m.loanBorrowedSar += amt;
            m.loanOutstandingSar += amt;
          }
          poolEm -= amt;
          if (t.bank === "ksa") ksaSar -= amt;
          if (t.bank === "pk") pkPkr += t.amountPkr;
          break;
        }
        case "repay": {
          const amt = Math.abs(t.amountSar);
          if (m) {
            m.loanRepaidSar += amt;
            m.loanOutstandingSar = Math.max(0, m.loanOutstandingSar - amt);
          }
          poolEm += amt;
          if (t.bank === "ksa") ksaSar += amt;
          if (t.bank === "pk") pkPkr += t.amountPkr;
          break;
        }
        case "withdraw": {
          if (m) m.withdrawnPkr += Math.abs(t.amountPkr);
          if (t.bank === "pk") pkPkr += t.amountPkr;
          if (t.bank === "ksa") ksaSar += t.amountSar;
          poolInv += t.amountSar;
          break;
        }
        case "project_purchase": {
          if (t.bank === "pk") pkPkr += t.amountPkr;
          if (t.bank === "ksa") ksaSar += t.amountSar;
          poolInv += t.amountSar;
          break;
        }
        case "project_sale": {
          if (t.bank === "ksa") ksaSar += t.amountSar;
          if (t.bank === "pk") pkPkr += t.amountPkr;
          poolInv += t.amountSar;
          month.revenuePkr += Math.abs(t.amountPkr);
          break;
        }
        case "project_expense": {
          if (t.bank === "pk") pkPkr += t.amountPkr;
          if (t.bank === "ksa") ksaSar += t.amountSar;
          poolInv += t.amountSar;
          month.expensesPkr += Math.abs(t.amountPkr);
          break;
        }
        case "profit_to_capital": {
          if (m) {
            m.investmentSar += Math.abs(t.amountSar);
            m.lifetimeInvestmentSar += Math.abs(t.amountSar);
            m.capitalizedProfitPkr += Math.abs(t.amountPkr);
          }
          break;
        }
      }
    }
    const projectSnaps = {};
    for (const p of projects) {
      projectSnaps[p.id] = {
        id: p.id,
        purchasePkr: 0,
        purchaseSar: 0,
        expensesPkr: 0,
        salePkr: 0,
        profitPkr: 0,
        realized: p.status === "sold",
        deployedPkr: 0
      };
    }
    for (const t of sorted) {
      if (!t.projectId) continue;
      const row = projectSnaps[t.projectId];
      if (!row) continue;
      if (t.type === "project_purchase") {
        row.purchasePkr += Math.abs(t.amountPkr);
        row.purchaseSar += Math.abs(t.amountSar);
      } else if (t.type === "project_expense") {
        row.expensesPkr += Math.abs(t.amountPkr);
      } else if (t.type === "project_sale") {
        row.salePkr += Math.abs(t.amountPkr);
      }
    }
    let soldPurchasePkr = 0;
    let projectSalesPkr = 0;
    let projectExpensePkr = 0;
    let unsoldPurchasePkr = 0;
    for (const p of projects) {
      const row = projectSnaps[p.id];
      row.realized = p.status === "sold" || row.salePkr > 0.5;
      row.profitPkr = row.salePkr - row.purchasePkr - row.expensesPkr;
      row.deployedPkr = row.realized ? 0 : row.purchasePkr;
      projectExpensePkr += row.expensesPkr;
      projectSalesPkr += row.salePkr;
      if (row.realized) soldPurchasePkr += row.purchasePkr;
      else unsoldPurchasePkr += row.purchasePkr;
    }
    const deployedPkr = unsoldPurchasePkr;
    const totalRevenuePkr = revenuePkr + projectSalesPkr;
    const totalExpensesPkr = expensesPkr + projectExpensePkr + soldPurchasePkr;
    const netProfitPkr = totalRevenuePkr - totalExpensesPkr;
    const totalInv = MEMBERS.reduce((s, d) => s + members[d.id].investmentSar, 0);
    for (const def of MEMBERS) {
      const m = members[def.id];
      m.capitalBookPkr = m.investmentSar * settings.defaultRate;
      const share = netProfitPkr >= 0 ? def.profitShare : def.lossShare;
      const allocated = netProfitPkr * share / 100;
      m.allocatedPkr = Math.abs(allocated) < 5e-3 ? 0 : allocated;
      m.individualProfitPkr = m.allocatedPkr > 0 ? m.allocatedPkr : 0;
      m.individualLossPkr = m.allocatedPkr < 0 ? Math.abs(m.allocatedPkr) : 0;
      m.ownershipPct = totalInv > 0 ? m.investmentSar / totalInv * 100 : 0;
      const invRemain = def.investmentTargetSar - m.investmentSar;
      const emRemain = def.emergencyTargetSar - m.emergencySar;
      m.investmentRemainingSar = invRemain;
      m.emergencyRemainingSar = emRemain;
      m.targetsComplete = def.role !== "ksa" || invRemain <= 0 && emRemain <= 0 && m.loanOutstandingSar <= 0;
      m.deployedSharePkr = totalInv > 0 ? deployedPkr * m.investmentSar / totalInv : 0;
      m.investablePkr = m.capitalBookPkr - m.deployedSharePkr;
      if (m.allocatedPkr > 0) {
        if (def.role === "operator") {
          m.realisedPkr = m.allocatedPkr * settings.operatorRealisedFraction;
          m.unrealisedPkr = m.allocatedPkr - m.realisedPkr;
          m.canWithdrawProfit = m.realisedPkr - m.withdrawnPkr > 0;
        } else if (def.role === "sadaqah") {
          m.realisedPkr = m.allocatedPkr;
          m.unrealisedPkr = 0;
          m.canWithdrawProfit = true;
        } else {
          const eligible = m.allocatedPkr >= settings.profitRealiseThresholdPkr && m.targetsComplete;
          m.realisedPkr = eligible ? m.allocatedPkr * settings.ksaRealisedFraction : 0;
          m.unrealisedPkr = m.allocatedPkr - m.realisedPkr;
          m.canWithdrawProfit = eligible && m.realisedPkr - m.withdrawnPkr > 0;
        }
      } else {
        m.unrealisedPkr = m.allocatedPkr;
        m.realisedPkr = 0;
        m.canWithdrawProfit = false;
      }
      m.availableProfitPkr = m.allocatedPkr > 0 ? Math.max(0, m.allocatedPkr - m.withdrawnPkr - m.capitalizedProfitPkr) : 0;
      m.canMoveToInvestment = m.availableProfitPkr > 0.5;
      m.netPositionPkr = m.capitalBookPkr + m.allocatedPkr - m.withdrawnPkr - m.capitalizedProfitPkr;
      let projectProfit = 0;
      for (const p of projects) {
        const rec = projectSnaps[p.id];
        if (!rec?.realized) continue;
        const sharePct = rec.profitPkr >= 0 ? def.profitShare : def.lossShare;
        projectProfit += rec.profitPkr * sharePct / 100;
      }
      m.projectProfitPkr = projectProfit;
    }
    const monthly = [...monthlyMap.values()].sort((a, b) => a.month.localeCompare(b.month));
    const cashSarEquivalent = ksaSar + pkPkr / settings.defaultRate;
    return {
      banks: { ksaSar, pkPkr },
      pools: { investmentSar: poolInv, emergencySar: poolEm },
      revenuePkr: totalRevenuePkr,
      expensesPkr: totalExpensesPkr,
      revenueSar,
      netProfitPkr,
      deployedPkr,
      members,
      projects: projectSnaps,
      monthly,
      cashSarEquivalent,
      totalInvestmentSar: totalInv
    };
  }
  function typeLabel(type) {
    switch (type) {
      case "contribution":
        return "Contribution";
      case "fund_transfer":
        return "Fund transfer";
      case "fx_transfer":
        return "KSA \u2192 Pakistan";
      case "expense":
        return "Expense";
      case "revenue":
        return "Revenue";
      case "deploy":
        return "Deployed";
      case "loan":
        return "Qard Hasan";
      case "repay":
        return "Loan repaid";
      case "withdraw":
        return "Withdrawal";
      case "project_purchase":
        return "Project purchase";
      case "project_sale":
        return "Project sale";
      case "project_expense":
        return "Project expense";
      case "profit_to_capital":
        return "Profit \u2192 investment";
    }
  }
  function buildMemberAccount(memberId, transactions, rate, opts = {}) {
    const invTarget = opts.investmentTargetSar ?? 0;
    const sorted = [...transactions].filter((t) => t.memberId === memberId).sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.id.localeCompare(b.id));
    let investmentSar = 0;
    let emergencySar = 0;
    let loanOut = 0;
    let salaryRun = 0;
    let cashInSar = 0;
    let cashInPkr = 0;
    const statement = [];
    const activities = [];
    const investment = [];
    const emergency = [];
    const loans = [];
    const salary = [];
    for (const t of sorted) {
      const amt = Math.abs(t.amountSar);
      let displaySar = t.amountSar;
      let displayPkr = t.amountPkr;
      switch (t.type) {
        case "contribution": {
          cashInSar += t.amountSar;
          cashInPkr += t.amountPkr;
          if (t.fund === "emergency") {
            emergencySar += t.amountSar;
            emergency.push({
              id: t.id,
              date: t.date,
              description: t.description,
              amountSar: t.amountSar,
              amountPkr: t.amountPkr,
              runningSar: emergencySar,
              remainingSar: (opts.emergencyTargetSar ?? 0) - emergencySar
            });
          } else {
            investmentSar += t.amountSar;
            investment.push({
              id: t.id,
              date: t.date,
              description: t.description,
              amountSar: t.amountSar,
              amountPkr: t.amountPkr,
              runningSar: investmentSar,
              remainingSar: invTarget - investmentSar
            });
          }
          break;
        }
        case "fund_transfer": {
          if (t.fund === "investment") {
            emergencySar -= amt;
            investmentSar += amt;
            emergency.push({
              id: `${t.id}-out`,
              date: t.date,
              description: t.description,
              amountSar: -amt,
              amountPkr: -Math.abs(t.amountPkr),
              runningSar: emergencySar,
              remainingSar: (opts.emergencyTargetSar ?? 0) - emergencySar
            });
            investment.push({
              id: `${t.id}-in`,
              date: t.date,
              description: t.description,
              amountSar: amt,
              amountPkr: Math.abs(t.amountPkr),
              runningSar: investmentSar,
              remainingSar: invTarget - investmentSar
            });
            displaySar = amt;
            displayPkr = Math.abs(t.amountPkr);
          } else {
            investmentSar -= amt;
            emergencySar += amt;
            investment.push({
              id: `${t.id}-out`,
              date: t.date,
              description: t.description,
              amountSar: -amt,
              amountPkr: -Math.abs(t.amountPkr),
              runningSar: investmentSar,
              remainingSar: invTarget - investmentSar
            });
            emergency.push({
              id: `${t.id}-in`,
              date: t.date,
              description: t.description,
              amountSar: amt,
              amountPkr: Math.abs(t.amountPkr),
              runningSar: emergencySar,
              remainingSar: (opts.emergencyTargetSar ?? 0) - emergencySar
            });
            displaySar = amt;
            displayPkr = Math.abs(t.amountPkr);
          }
          break;
        }
        case "loan": {
          loanOut += amt;
          loans.push({
            id: t.id,
            date: t.date,
            description: t.description,
            borrowedSar: amt,
            repaidSar: 0,
            outstandingSar: loanOut
          });
          displaySar = -amt;
          displayPkr = t.amountPkr;
          break;
        }
        case "repay": {
          loanOut = Math.max(0, loanOut - amt);
          loans.push({
            id: t.id,
            date: t.date,
            description: t.description,
            borrowedSar: 0,
            repaidSar: amt,
            outstandingSar: loanOut
          });
          displaySar = amt;
          displayPkr = t.amountPkr;
          break;
        }
        case "expense": {
          if (t.category === "Salary") {
            const pay = Math.abs(t.amountPkr);
            salaryRun += pay;
            salary.push({
              id: t.id,
              date: t.date,
              description: t.description,
              amountPkr: pay,
              runningPkr: salaryRun
            });
            displaySar = Math.abs(t.amountSar);
            displayPkr = pay;
          }
          break;
        }
        case "profit_to_capital": {
          investmentSar += Math.abs(t.amountSar);
          investment.push({
            id: t.id,
            date: t.date,
            description: t.description,
            amountSar: Math.abs(t.amountSar),
            amountPkr: Math.abs(t.amountPkr),
            runningSar: investmentSar,
            remainingSar: invTarget - investmentSar
          });
          displaySar = Math.abs(t.amountSar);
          displayPkr = Math.abs(t.amountPkr);
          break;
        }
        default:
          break;
      }
      statement.push({
        id: t.id,
        date: t.date,
        type: t.type,
        fund: t.fund,
        description: t.description,
        category: t.category,
        amountSar: t.amountSar,
        amountPkr: t.amountPkr,
        displaySar,
        displayPkr,
        runningInvestmentSar: investmentSar,
        runningEmergencySar: emergencySar,
        runningBookPkr: investmentSar * rate,
        runningRemainingSar: invTarget - investmentSar
      });
      activities.push({
        serial: activities.length + 1,
        id: t.id,
        date: t.date,
        type: t.type,
        fund: t.fund,
        description: t.description,
        amountSar: displaySar,
        amountPkr: displayPkr,
        primary: t.bank === "pk" || t.type === "expense" ? "PKR" : "SAR",
        runningInvestmentSar: investmentSar,
        runningEmergencySar: emergencySar
      });
    }
    return {
      statement,
      activities,
      investment,
      emergency,
      loans,
      salary,
      firstDate: sorted[0]?.date ?? null,
      lastDate: sorted[sorted.length - 1]?.date ?? null,
      movementCount: sorted.length,
      cashInSar,
      cashInPkr
    };
  }

  // src/lib/seed.ts
  var DEFAULT_KEEPER_PASSWORD = "Ishtiaq@2026";
  var DEFAULT_SETTINGS = {
    defaultRate: 73.5,
    emergencyTargetSar: 3e4,
    investmentTargetSar: 4e4,
    emergencyPerPartnerSar: 6e3,
    profitRealiseThresholdPkr: 5e5,
    ksaRealisedFraction: 0.2,
    operatorRealisedFraction: 0.5
  };
  var R = 73.5;
  function tx(partial) {
    return {
      projectId: null,
      ...partial,
      bankHolderId: partial.bankHolderId ?? "ishtiaq",
      createdAt: partial.createdAt ?? `${partial.date}T09:00:00.000Z`
    };
  }
  var SEED_TRANSACTIONS = [
    tx({
      id: "seed-01",
      date: "2026-02-04",
      type: "contribution",
      memberId: "afaq",
      description: "Emergency contribution (part of 8,000 SAR sent to Ishtiaq)",
      fund: "emergency",
      amountSar: 6e3,
      amountPkr: 6e3 * R,
      rate: R,
      bank: "ksa",
      category: "Emergency"
    }),
    tx({
      id: "seed-02",
      date: "2026-02-04",
      type: "contribution",
      memberId: "afaq",
      description: "Investment contribution (part of 8,000 SAR sent to Ishtiaq)",
      fund: "investment",
      amountSar: 2e3,
      amountPkr: 2e3 * R,
      rate: R,
      bank: "ksa",
      category: "Investment"
    }),
    tx({
      id: "seed-03",
      date: "2026-02-11",
      type: "contribution",
      memberId: "abdullah",
      description: "Emergency contribution transferred to Ishtiaq",
      fund: "emergency",
      amountSar: 6e3,
      amountPkr: 6e3 * R,
      rate: R,
      bank: "ksa",
      category: "Emergency"
    }),
    tx({
      id: "seed-04",
      date: "2026-02-23",
      type: "contribution",
      memberId: "abdullah",
      description: "Deposited to Pakistan investment account (MCB)",
      fund: "investment",
      amountSar: 34e3,
      amountPkr: 2499e3,
      rate: 2499e3 / 34e3,
      bank: "pk",
      category: "Investment"
    }),
    tx({
      id: "seed-05",
      date: "2026-03-02",
      type: "revenue",
      memberId: null,
      description: "Profit from gold buy / sell",
      fund: "investment",
      amountSar: 33,
      amountPkr: 33 * R,
      rate: R,
      bank: "ksa",
      category: "Gold"
    }),
    tx({
      id: "seed-06",
      date: "2026-03-12",
      type: "contribution",
      memberId: "abdullah",
      description: "Deposited to Pakistan investment account",
      fund: "investment",
      amountSar: 5238,
      amountPkr: 385e3,
      rate: 385e3 / 5238,
      bank: "pk",
      category: "Investment"
    }),
    tx({
      id: "seed-07",
      date: "2026-04-02",
      type: "contribution",
      memberId: "abdullah",
      description: "Transferred to Ishtiaq MCB account",
      fund: "investment",
      amountSar: 5221,
      amountPkr: 383750,
      rate: 383750 / 5221,
      bank: "pk",
      category: "Investment"
    }),
    tx({
      id: "seed-08",
      date: "2026-04-05",
      type: "contribution",
      memberId: "asim",
      description: "Emergency contribution",
      fund: "emergency",
      amountSar: 2e3,
      amountPkr: 2e3 * R,
      rate: R,
      bank: "ksa",
      category: "Emergency"
    }),
    tx({
      id: "seed-09",
      date: "2026-05-02",
      type: "fund_transfer",
      memberId: "afaq",
      description: "Emergency balance moved into investment",
      fund: "investment",
      amountSar: 6e3,
      amountPkr: 6e3 * R,
      rate: R,
      bank: "none",
      category: "Reallocation"
    }),
    tx({
      id: "seed-10",
      date: "2026-05-02",
      type: "fund_transfer",
      memberId: "abdullah",
      description: "Emergency balance moved into investment",
      fund: "investment",
      amountSar: 6e3,
      amountPkr: 6e3 * R,
      rate: R,
      bank: "none",
      category: "Reallocation"
    }),
    tx({
      id: "seed-11",
      date: "2026-05-02",
      type: "fund_transfer",
      memberId: "asim",
      description: "Emergency balance moved into investment",
      fund: "investment",
      amountSar: 2e3,
      amountPkr: 2e3 * R,
      rate: R,
      bank: "none",
      category: "Reallocation"
    }),
    tx({
      id: "seed-12",
      date: "2026-05-02",
      type: "contribution",
      memberId: "inam",
      description: "Investment contribution",
      fund: "investment",
      amountSar: 2e3,
      amountPkr: 2e3 * R,
      rate: R,
      bank: "ksa",
      category: "Investment"
    }),
    tx({
      id: "seed-13",
      date: "2026-05-02",
      type: "contribution",
      memberId: "afaq",
      description: "Investment contribution",
      fund: "investment",
      amountSar: 3118,
      amountPkr: 3118 * R,
      rate: R,
      bank: "ksa",
      category: "Investment"
    }),
    tx({
      id: "seed-14",
      date: "2026-05-02",
      type: "contribution",
      memberId: "ishtiaq",
      description: "Investment contribution",
      fund: "investment",
      amountSar: 2e3,
      amountPkr: 2e3 * R,
      rate: R,
      bank: "ksa",
      category: "Investment"
    }),
    tx({
      id: "seed-15",
      date: "2026-05-02",
      type: "expense",
      memberId: "amad",
      description: "Salary for April 2026",
      fund: "operating",
      amountSar: -15e3 / R,
      amountPkr: -15e3,
      rate: R,
      bank: "pk",
      category: "Salary"
    }),
    tx({
      id: "seed-16",
      date: "2026-05-06",
      type: "contribution",
      memberId: "inam",
      description: "Deposited in Pakistan for investment",
      fund: "investment",
      amountSar: 4831,
      amountPkr: 357500,
      rate: 357500 / 4831,
      bank: "pk",
      category: "Investment"
    }),
    tx({
      id: "seed-17",
      date: "2026-05-21",
      type: "fx_transfer",
      memberId: null,
      description: "Transferred from KSA to Pakistan account",
      fund: "investment",
      amountSar: -2544,
      amountPkr: 186475.2,
      rate: 186475.2 / 2544,
      bank: "ksa",
      category: "FX"
    }),
    tx({
      id: "seed-18",
      date: "2026-05-21",
      type: "fx_transfer",
      memberId: null,
      description: "Transferred from KSA to Pakistan account",
      fund: "investment",
      amountSar: -20607,
      amountPkr: 15104931e-1,
      rate: 15104931e-1 / 20607,
      bank: "ksa",
      category: "FX"
    }),
    tx({
      id: "seed-19",
      date: "2026-06-06",
      type: "expense",
      memberId: "amad",
      description: "Salary for May 2026",
      fund: "operating",
      amountSar: -15e3 / R,
      amountPkr: -15e3,
      rate: R,
      bank: "pk",
      category: "Salary"
    }),
    tx({
      id: "seed-20",
      date: "2026-06-28",
      type: "expense",
      memberId: "amad",
      description: "Salary for June 2026",
      fund: "operating",
      amountSar: -15e3 / R,
      amountPkr: -15e3,
      rate: R,
      bank: "pk",
      category: "Salary"
    }),
    tx({
      id: "seed-21",
      date: "2026-06-28",
      type: "contribution",
      memberId: "inam",
      description: "Investment contribution",
      fund: "investment",
      amountSar: 2e3,
      amountPkr: 2e3 * R,
      rate: R,
      bank: "ksa",
      category: "Investment"
    }),
    tx({
      id: "seed-22",
      date: "2026-07-30",
      type: "contribution",
      memberId: "afaq",
      description: "Investment contribution",
      fund: "investment",
      amountSar: 3e3,
      amountPkr: 3e3 * R,
      rate: R,
      bank: "ksa",
      category: "Investment"
    }),
    tx({
      id: "seed-23",
      date: "2026-07-30",
      type: "expense",
      memberId: "amad",
      description: "Salary for July 2026",
      fund: "operating",
      amountSar: -15e3 / R,
      amountPkr: -15e3,
      rate: R,
      bank: "pk",
      category: "Salary"
    }),
    tx({
      id: "seed-24",
      date: "2026-08-14",
      type: "contribution",
      memberId: "abdullah",
      description: "Deposited to Pakistan investment account",
      fund: "investment",
      amountSar: 23119,
      amountPkr: 16992465e-1,
      rate: 16992465e-1 / 23119,
      bank: "pk",
      category: "Investment"
    }),
    tx({
      id: "seed-25",
      date: "2026-09-05",
      type: "fx_transfer",
      memberId: null,
      description: "Transferred from KSA to Pakistan account",
      fund: "investment",
      amountSar: -5e3,
      amountPkr: 367500,
      rate: 367500 / 5e3,
      bank: "ksa",
      category: "FX"
    }),
    tx({
      id: "seed-26",
      date: "2026-09-06",
      type: "contribution",
      memberId: "inam",
      description: "Deposited in Pakistan for investment",
      fund: "investment",
      amountSar: 2e3,
      amountPkr: 147e3,
      rate: 147e3 / 2e3,
      bank: "pk",
      category: "Investment"
    }),
    tx({
      id: "seed-27",
      date: "2026-09-06",
      type: "expense",
      memberId: "amad",
      description: "Salary for August 2026",
      fund: "operating",
      amountSar: -15e3 / R,
      amountPkr: -15e3,
      rate: R,
      bank: "pk",
      category: "Salary"
    })
  ];

  // src/lib/constitution.ts
  var CONSTITUTION = [
    {
      id: "purpose",
      number: "0",
      title: "Purpose and vision",
      body: [
        "A long-term partnership to build halal, sustainable, scalable business income in Pakistan while partners work in KSA.",
        "Highest priority: every partner has mental peace that six sincere partners stand behind him in emergencies and in life.",
        "No shortcuts. Patience, discipline, transparency."
      ]
    },
    {
      id: "partners",
      number: "1",
      title: "Partners and roles",
      body: [
        "Five equal KSA partners: Muhammad Ishtiaq, Inam Ur Rehman, Abdullah, Muhammad Asim, Afaq Khan \u2014 capital, decisions, emergency support, long-term growth.",
        "Pakistan operator: Muhammad Amad Khan, full-time manager. 10% of total profit. No loss sharing except fraud, manipulation, breach of authority, misuse of funds, or hiding facts.",
        "Amad is engaged for three years. Other income requires Ishtiaq\u2019s review and the right of all KSA partners to know."
      ]
    },
    {
      id: "halal",
      number: "2",
      title: "Halal compliance",
      body: [
        "No interest-based borrowing. No riba at any cost.",
        "No haram sectors or unethical dealings.",
        "A proposed business that violates this is automatically rejected."
      ]
    },
    {
      id: "targets",
      number: "3",
      title: "Core targets",
      body: [
        "Emergency fund must sit at 30,000 SAR at all times. Used only as Qard Hasan, never as a gift.",
        "Each KSA partner must fulfil the capital target the team sets. Timing may differ; the target is mandatory.",
        "No outside investment while claiming inability to contribute if partnership targets are incomplete."
      ]
    },
    {
      id: "pl",
      number: "4",
      title: "Profit and loss",
      body: [
        "Business profit: 10% Amad, 1% Allah\u2019s Path, remainder equal among the five KSA partners (17.8% each).",
        "Losses are shared equally among the five KSA partners even if a target is still open. Brotherhood clause.",
        "Profit is first allocated as unrealised. A KSA partner may realise only 20% once allocated profit reaches PKR 500,000 and every target (including any emergency loan) is complete. The other 80% stays retained.",
        "Amad may withdraw 50% of his share; 50% is retained for liquidity."
      ]
    },
    {
      id: "emergency",
      number: "5",
      title: "Emergency fund",
      body: [
        "Planned emergencies: two months\u2019 notice. Unplanned: medical, funeral, job loss, legal defence, home disaster, or other cases Ishtiaq accepts.",
        "Final approval is assigned to Ishtiaq. The loan is recorded, the 30,000 SAR floor is restored from investment cash, and the partner repays on an agreed timeline.",
        "Partners are told amount and category. Detail stays with Ishtiaq."
      ]
    },
    {
      id: "calamity",
      number: "6",
      title: "Calamity and ownership",
      body: [
        "Death or permanent disability: the partner remains in existing businesses. Unpaid target may be taken from future profit. New businesses need completed target or a family nominee contributing.",
        "Full target: equal partner. 50% target plus calamity: treated as full partner in that business only. No contribution: no participation in a new business.",
        "If the same business scales and a partner does not add capital, ownership becomes capital-weighted."
      ]
    },
    {
      id: "disagree",
      number: "7",
      title: "Disagreement \u2014 50% release",
      body: [
        "If a partner disagrees with an investment, up to 50% of eligible principal may return on the payout schedule. The other 50% is locked as Qard Hasan to the partnership \u2014 principal guaranteed, no profit, repaid on exit.",
        "Three consecutive disagreements: majority of four KSA members may remove him and return money on agreed terms."
      ]
    },
    {
      id: "withdraw",
      number: "8",
      title: "Withdrawal and liquidity",
      body: [
        "Capital is not withdrawn casually. Only emergency policy, profit realisation, or the exit payout schedule."
      ]
    },
    {
      id: "discipline",
      number: "9",
      title: "Integrity",
      body: [
        "Manipulation, conflict, or repeated disturbance: one written warning, then removal.",
        "Lying that affects the system \u2014 hiding spare money, false emergencies, hiding transactions \u2014 one warning, then immediate removal."
      ]
    },
    {
      id: "exit",
      number: "10",
      title: "Exit / removal",
      body: [
        "Invested capital plus eligible profit is returned within 6\u201312 months depending on liquidity. Emergency benefits stop on exit."
      ]
    },
    {
      id: "decisions",
      number: "11",
      title: "Decisions",
      body: [
        "Pakistan operations: Amad. Strategy: discussion among partners. Constitution changes: unanimous among the five KSA partners."
      ]
    },
    {
      id: "docs",
      number: "12",
      title: "Documentation",
      body: [
        "Every movement is recorded. Partners see emergency floor, capital by partner, P&L, deployed funds, and receivables."
      ]
    }
  ];

  // src/lib/projects.ts
  var PROJECT_KINDS = [
    { value: "plot", label: "Buying a plot" },
    { value: "home", label: "Buying a house" },
    { value: "shop", label: "Buying a shop" },
    { value: "gold", label: "Gold" },
    { value: "vehicle", label: "Vehicle" },
    { value: "other", label: "Other deal" }
  ];
  var EXPENSE_CATEGORIES = [
    "Registry / mutation",
    "Development",
    "Tax / duties",
    "Legal / lawyer",
    "Labour",
    "Utilities",
    "Broker / commission",
    "Other"
  ];
  function kindLabel(kind) {
    return PROJECT_KINDS.find((k) => k.value === kind)?.label ?? kind;
  }
  function memberProjectSharePkr(member, row) {
    if (!row?.realized) return 0;
    const share = row.profitPkr >= 0 ? member.profitShare : member.lossShare;
    return row.profitPkr * share / 100;
  }
  return __toCommonJS(android_core_exports);
})();
