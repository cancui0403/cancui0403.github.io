---
layout: post
title: "Alignment Strategies in Latent Space Models: Theory and Algorithms"
date: 2025-04-19 16:11:00-0400
inline: false
related_posts: false
---

> **Abstract**
> Distance-based latent space models possess an inherent invariance to Euclidean isometries (rotations, reflections, translations). This invariance manifests as **non-identifiability** in statistical inference.
>
> Practically, this leads to two major issues: (1) **Within-subject instability**, where MCMC chains drift along equivalence orbits, making convergence diagnosis difficult; and (2) **Between-subject incoherence**, where coordinate systems lack a common basis, rendering cross-subject statistics (e.g., group means) invalid.
>
> This note details a **Two-Stage Procrustes Alignment Strategy**. Grounded in the assumption of an "Approximate Shared Shape," this method maps all posterior samples into a common coordinate frame via orthogonal transformations. Crucially, this restores comparability without altering the likelihood or the intrinsic geometry of the data.

---

## 1. The Geometric Problem: Isometric Invariance

### 1.1 Model Setup
Consider $p$ subjects, indexed by $i$. For each subject, we model the observed data (e.g., an adjacency matrix $A_i$) using latent coordinates $X_i \in \mathbb{R}^{n \times r}$ for $n$ nodes in an $r$-dimensional Euclidean space.

In distance-based models, the likelihood function $L(X_i; A_i)$ depends solely on the pairwise Euclidean distances between rows:
$$
d_{jk}(X_i) = \| X_{i,j} - X_{i,k} \|_2
$$

### 1.2 Non-identifiability
Let $E(r)$ denote the Euclidean group, consisting of all orthogonal matrices $Q \in \mathcal{O}(r)$ and translation vectors $t \in \mathbb{R}^r$. An isometry $g = (Q, t)$ acts on a configuration $X$ as:
$$
g \cdot X = X Q^T + \mathbf{1} t^T
$$
Since distances are invariant under the action of $E(r)$, the likelihood satisfies:
$$
L(g \cdot X_i) = L(X_i), \quad \forall g \in E(r)
$$
Consequently, the posterior distribution $P(X_i | A_i)$ is not concentrated around a single point $X_i$, but is diffused across the entire equivalence class (or orbit) $[X_i] = \{ g \cdot X_i \mid g \in E(r) \}$. Without intervention, an ergodic MCMC sampler will wander across this orbit, rendering marginal summaries of raw coordinates meaningless.

### 1.3 Consequences: The Dual Dilemma of Statistical Inference
Failure to explicitly account for this geometric invariance renders standard MCMC methods susceptible to two critical statistical issues:

#### (a) Individual Level: MCMC Drift and Diagnostic Failure
Since the likelihood function remains flat along the entire rotational orbit, the MCMC sampler lacks any incentive to remain fixed in a specific orientation.

* **Drifting**: The sampling chain undergoes a random walk within the parameter space (specifically, along the equivalence orbit). Even if the relative positions (shape) of the latent variables have converged, their absolute coordinate values continue to fluctuate.
* **Invalid Statistics**: Under these conditions, calculating posterior means or credible intervals for raw coordinates becomes meaningless. For instance, if the chain rotates around the origin, samples from opposing orientations cancel each other out. This causes the mean to shrink toward zero (a form of **mode collapse**), falsely implying that all nodes are clustered at the center.
* **Diagnostic Difficulty**: Standard convergence diagnostics (such as trace plots or the Gelman-Rubin statistic) will indicate "non-convergence" due to the persistent drift of coordinates, even when the model's internal distance structure has fully stabilized.

#### (b) Group Level: Lack of a Common Baseline for Cross-Subject Comparison
In multi-subject analyses, the latent space for each subject $i$ is generated independently.

* **Arbitrary Reference Frames**: "Up" for Subject A may correspond to "Left" for Subject B.
* **Incomparability**: Directly comparing $X_{A, k}$ and $X_{B, k}$ (i.e., the coordinates of the same node across two individuals) is akin to comparing readings from two uncalibrated clocks.
* **Invalid Group Means**: Without alignment, computing the group average configuration $\frac{1}{p}\sum X_i$ is equivalent to averaging a stack of photographs taken from random angles. The result is merely blurred noise that fails to capture any shared topological structure.

---

## 2. Core Assumption: Approximate Shared Shape

Before aligning different subjects, we must establish a theoretical basis for their comparability. Alignment is only statistically valid if the underlying latent structures share a common topology.

> **Assumption 1: Existence of a Common Template**
> We assume there exists an unknown, centered "true" template configuration $T \in \mathbb{R}^{n \times r}$. For each subject $i$, the latent coordinates $X_i$ are a transformation of this template subject to individual noise:
> $$
> X_i = T Q_i^T + \mathbf{1} t_i^T + E_i
> $$
> where $Q_i \in \mathcal{O}(r)$ is a subject-specific rotation, $t_i$ is a translation, and $E_i$ represents random perturbations specific to the subject. We assume $\|E_i\|_F$ is small relative to the structural signal.

**Statistical Implication:**
This assumption implies that node $k$ plays a geometrically similar role across all subjects. Under this condition, Procrustes alignment—which minimizes the distance between configurations via isometries—becomes a consistent estimator for the shared structure.

---

## 3. Algorithm: Two-Stage Procrustes Alignment

To resolve the non-identifiability and isolate the term $E_i$, we employ a two-stage strategy.

### Stage I: Group-level Alignment (Establishing the Frame)
**Goal:** Remove fixed subject-specific rigid body transformations $(Q_i, t_i)$ to establish a unified reference frame.

1.  **Compute Individual Short-Window Baselines**:
    Due to the rotational invariance, an MCMC chain will experience slow global rotation (drift) over time. Averaging the entire chain causes samples from different orientations to cancel out, leading to **attenuation** (shrinkage of coordinates toward the origin).
    
    Therefore, we define the baseline using a **moderate window** $w$ at the end of the chain:
    $$
    \bar{X}_i^{init} = \frac{1}{w} \sum_{t=M-w+1}^M X_i^{(t)}
    $$
    This baseline is then centered:
    $$
    \bar{X}_i = \bar{X}_i^{init} - \mathbf{1}_n \bar{x}_i^T, \quad \text{where } \bar{x}_i = \frac{1}{n} (\bar{X}_i^{init})^T \mathbf{1}_n
    $$

    > **Technical Note on Window Size $w$:**
    > * **Too Long:** The chain drifts significantly; averaging induces shape collapse/attenuation.
    > * **Too Short:** The mean is dominated by high-frequency MCMC noise and lacks stability.
    > * **Strategy:** Select a window where the Procrustes distance between iterations is stable, typically the last 100-500 iterations depending on mixing speed.

2.  **Determine Reference Template**:
    Select a reference configuration $X_{ref}$. This can be the baseline of the first subject ($X_{ref} = \bar{X}_1$) or the consensus mean computed via Generalized Procrustes Analysis (GPA).

3.  **Orthogonal Procrustes Transformation**:
    For each subject $i$, find the optimal orthogonal matrix $R_i^*$ that minimizes the Frobenius norm distance to the reference:
    $$
    R_i^* = \arg\min_{R \in \mathcal{O}(r)} \| X_{ref} - \bar{X}_i R^T \|_F
    $$
    *Solution via SVD:* Let $X_{ref}^T \bar{X}_i = U \Sigma V^T$. Then $R_i^* = U V^T$.

4.  **Update Baseline**:
    Set $\hat{X}_i = \bar{X}_i (R_i^*)^T$. All subject baselines are now aligned in a common coordinate system.

---

### Stage II: Within-Chain Alignment (Stabilizing the Trajectory)
**Goal:** Eliminate random rotational drift within the MCMC process, "pinning" every iteration to the subject's specific aligned baseline.

At MCMC iteration $t$ for subject $i$:

1.  **Centering**: Remove the translation component:
    $$
    X_i^{(t)} \leftarrow X_i^{(t)} - \mathbf{1}(\text{mean}(X_i^{(t)}))
    $$

2.  **Procrustes Projection**:
    Align the current draw $X_i^{(t)}$ to the subject's Stage I baseline $\hat{X}_i$. Solve:
    $$
    Q^{(t)} = \arg\min_{Q \in \mathcal{O}(r)} \| \hat{X}_i - X_i^{(t)} Q^T \|_F
    $$
    (Again, solved via SVD).

3.  **Store Aligned Draw**:
    $$
    \tilde{X}_i^{(t)} = X_i^{(t)} (Q^{(t)})^T
    $$

**Theoretical Justification:**
The map $X \mapsto X Q^T$ is an isometry. Thus, the pairwise distance matrix of $\tilde{X}_i^{(t)}$ is identical to that of $X_i^{(t)}$, preserving the likelihood $L(\tilde{X}_i^{(t)}) = L(X_i^{(t)})$. Geometrically, this step effectively takes a **cross-section** of the posterior orbit, concentrating the probability mass in a specific orientation to enable summarization.

---

## 4. Post-Alignment Inference

Following this procedure, we obtain a set of aligned posterior samples $\{ \tilde{X}_i^{(t)} \}_{i,t}$ in a unified space. This enables:

1.  **Group-Level Inference**:
    We can validly compute the global mean latent position:
    $$
    X_{group} = \frac{1}{P} \sum_{i=1}^P \left( \frac{1}{M} \sum_{t=1}^M \tilde{X}_i^{(t)} \right)
    $$

2.  **Heterogeneity Analysis**:
    The individual deviation term $E_i \approx \hat{X}_i - X_{group}$ now represents true biological or structural variation rather than arbitrary rotation. The magnitude $\| E_i \|_F$ can be regressed against external covariates (e.g., age, clinical status).

3.  **Visualization**:
    Latent positions from multiple subjects can be superimposed in a single scatter plot to visualize the population-level variance of specific nodes.

## 5. Conclusion

In distance-based latent space models, coordinate arbitrariness is an intrinsic feature, not a bug. However, for comparative analysis, we must fix the gauge. The Procrustes alignment strategy described here is a rigorous method to extract a representative configuration from the quotient space. Its validity rests on the "Approximate Shared Shape" assumption—without which, the superposition of different latent spaces would be geometrically ill-posed.

