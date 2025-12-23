---
layout: post
title: "An Alignment Strategy in Latent Space Models"
date: 2025-04-19 16:11:00-0400
inline: false
related_posts: false
---

During my work on brain functional network with Prof. Kai Kang and Prof. Ben Wu, I met a severe identifiability issue in our initial latent space formulation. Although we did not take that fomulation later, I felt that the process of trying to solve this issue was rewarding. So I decided to record it. 


> **Abstract**
>
> **The Problem: Isometric Invariance**
> Distance-based latent space models possess an inherent invariance to Euclidean isometries (rotations, translations). This invariance manifests as non-identifiability in statistical inference.
>
> **The Consequences**
> Practically, this leads to two major issues:
> 1.  **Within-subject instability:** MCMC chains drift along equivalence orbits, making convergence diagnosis difficult.
> 2.  **Between-subject incoherence:** Coordinate systems lack a common basis, rendering cross-subject statistics (e.g., group means) invalid.
>
> **The Solution: Two-Stage Procrustes Alignment**
> This note details a strategy grounded in the assumption of an "Approximate Shared Shape." It maps all posterior samples into a common coordinate frame via orthogonal transformations. Moreover, this restores comparability without altering the likelihood or the intrinsic geometry of the data.

---

## 1. Isometric Invariance

### 1.1 Model Setup
Consider $p$ subjects, indexed by $i$. For each subject, we model the observed data (e.g., an adjacency matrix $A_i$) using latent coordinates $X_i \in \mathbb{R}^{n \times r}$ for $n$ nodes in an $r$-dimensional Euclidean space.

In distance-based models, the likelihood function $L(A_i; X_i)$ depends solely on the pairwise Euclidean distances between rows:
$$
d_{jk}(X_i) = \| X_{i,j} - X_{i,k} \|_2
$$

For example, let $A_i$ be a symmetric binary adjacency matrix representing the network topology. We model the marginal probability of a link between node $j$ and node $k$ as:
$$
\Pr(A_{i,jk} = 1 \mid X_i) = \frac{\exp(\eta_{ijk})}{1 + \exp(\eta_{ijk})},
$$
where the linear predictor is defined as $\eta_{ijk} = \alpha_j + \alpha_k - d_{jk}(X_i)$. Here, $\alpha_j$ accounts for node-level heterogeneity.

The Latent Space Model was introduced by [Hoff, Raftery, and Handcock (2002)](https://www.stat.cmu.edu/~brian/905-2009/all-papers/hoff-raftery-handcock-2002-jasa.pdf) to analyze social networks.

### 1.2 Non-identifiability
Let $E(r)$ denote the Euclidean group, consisting of all orthogonal matrices $Q \in \mathcal{O}(r)$ and translation vectors $t \in \mathbb{R}^r$. An isometry $g = (Q, t)$ acts on a configuration $X$ as:
$$
g \cdot X = X Q^T + \mathbf{1} t^T
$$
Since distances are invariant under the action of $E(r)$, the likelihood satisfies:
$$
L(g \cdot X_i) = L(X_i), \quad \forall g \in E(r)
$$
Consequently, the posterior distribution $P(X_i | A_i)$ is not concentrated around a single point $X_i$, but is diffused across the entire equivalence class (or orbit) $[X_i] = \{ g \cdot X_i \mid g \in E(r) \}$. Without intervention, an ergodic MCMC sampler will wander across this orbit.

In other words, for each subject, its network implies a "certain" structured group of nodes in the latent space. The structure that manifests as distances between any two nodes is alomst fixed and is invariant to isometries. 

### 1.3 Consequences
Failure to explicitly account for this geometric invariance renders standard MCMC methods susceptible to two critical statistical issues:

#### (a) Individual Level: Drift
Because the likelihood is flat along the equivalence orbit, the MCMC sampler undergoes a random walk in the orientation space. As a result, the chain for each of the subject drifts. Standard convergence diagnostics (e.g., trace plots) will reject the chain as "non-convergent" due to this drift.

#### (b) Group Level: Incomparability and Meaningless Statistics
Since each subject's latent space is realized in an arbitrary frame, raw coordinates are mathematically incommensurable across subjects. 

* **Incomparability**: Comparing Subject A’s node $k$ to Subject B’s node $k$ is invalid, as they are in different coordinate systems. Consider two structured groups of nodes, both of which are drifting in the latent spece. Clearly, they are imcomparable.

* **Meaningless Aggregation**: Standard group-level statistics fail. For example, if we want to study the community structure, which corresponds to clusters in the latent space, we might be interested in the centre of each cluster. Therefore, some summation $\sum_{i \in \text{Group C}} X_i$ could be important. Hovever, since the latent positions of the subjects in some Group C are not in the same coordinate system, the summation is meaningless and uninformative. 

---

## 2. Core Assumption: Approximate Shared Shape

Before aligning different subjects, we must establish a theoretical basis for their comparability. Alignment is only statistically valid if the underlying latent structures share a common topology. If not, the alignment is meanless, and we will not benefit from cross-subject statistics since no common structure is shared.

> **Assumption 1: Existence of a Common Template**
> We assume there exists an unknown, centered "true" template configuration $T \in \mathbb{R}^{n \times r}$. For each subject $i$, the latent coordinates $X_i$ are a transformation of this template subject to individual noise:
> $$
> X_i = T Q_i^T + \mathbf{1} t_i^T + E_i
> $$
> where $Q_i \in \mathcal{O}(r)$ is a subject-specific rotation, $t_i$ is a translation, and $E_i$ represents random perturbations specific to the subject. We assume $\|E_i\|_F$ is small relative to the structural signal.

**Statistical Implication:**
This assumption implies that node $k$ plays a geometrically similar role across all subjects. Under this condition, Procrustes alignment, which minimizes the distance between configurations via isometries, becomes a consistent estimator for the shared structure. 

---

## 3. Algorithm: Two-Stage Procrustes Alignment

To resolve the non-identifiability and isolate the term $E_i$, we employ a two-stage strategy.

### Stage I: Group-level Alignment (Establishing the Frame)
**Goal:** Remove fixed subject-specific rigid body transformations $(Q_i, t_i)$ to establish a unified reference frame. For all the structured groups of nodes, we will try to set a universal reference. In this way, the problem of cross-subject incomparability can be solved.

1.  **Compute Individual Short-Window Baselines**:
    Due to the rotational invariance, an MCMC chain will experience slow global rotation (drift) over time. Averaging the entire chain causes samples from different orientations to cancel out, leading to attenuation (shrinkage of coordinates toward the origin).
    
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
    Select a reference configuration $X_{ref}$. This can be the baseline of the first subject ($X_{ref} = \bar{X}_1$).

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
**Goal:** Eliminate random rotational drift within the MCMC process, pinning every iteration to the subject's specific aligned baseline. This stage is designed to eliminate the within-subject drift in the MCMC chain. The original form of this technique can be found in [Hoff, Raftery, and Handcock (2002)](https://www.stat.cmu.edu/~brian/905-2009/all-papers/hoff-raftery-handcock-2002-jasa.pdf). We extend it to our multi-subject setting.

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
The map $X \mapsto X Q^T$ is an isometry. Thus, the pairwise distance matrix of $\tilde{X}_i^{(t)}$ is identical to that of $X_i^{(t)}$, preserving the likelihood $L(\tilde{X}_i^{(t)}) = L(X_i^{(t)})$. Geometrically, this step effectively takes a cross-section of the posterior orbit, concentrating the probability mass in a specific orientation to enable summarization.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/space2.jpg" title="Before Alignment" class="img-fluid rounded z-depth-1" %}
    </div>

    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/space1.png" title="After Alignment" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Performance of the Alignment Strategy
</div>

---

## 4. Post-Alignment Inference

Following this procedure, we obtain a set of aligned posterior samples $$\{ \tilde{X}_i^{(t)} \}_{i,t}$$ in a unified space. We use $$\hat{X}_i$$ to denote the estimate of $$X_i$$. This enables:

1.  **Group-Level Inference**:
    We can validly compute the group mean latent position:
    $$
    X_{\text{Group C}} = \frac{1}{\#\{Group C \}} \sum_{\text{Group C}} \hat{X}_i
    $$

2.  **Heterogeneity Analysis**:
    By stripping away nuisance isometric transformations, the residual term $$E_i \approx \hat{X}_i - X_{\text{Group C}}$$ isolates genuine structural deviations from the population consensus. The norm $$\|E_i\|_F$$ thus serves as a valid metric of individual variability, enabling regression against external covariates (e.g., age, clinical status) to identify predictors of network abnormality.



## 5. Conclusion

In distance-based latent space models, coordinate arbitrariness is an intrinsic feature. However, for comparative analysis, we must fix the gauge. The Procrustes alignment strategy described here is a method to extract a representative configuration. Its validity rests on the "Approximate Shared Shape" assumption. Without it the superposition of different latent spaces would be geometrically ill-posed.

We have validated the strategy in extensive simulation studies. However, rigorous theoretical proof is still lacking. I hope to fix it after advanced training in statistical theory.

