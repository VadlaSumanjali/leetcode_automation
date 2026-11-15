package com.leetcodedaily.service;

import com.leetcodedaily.entity.Problem;
import com.leetcodedaily.repository.ProblemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProblemCatalogSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ProblemCatalogSeeder.class);
    private final ProblemRepository problemRepository;

    public ProblemCatalogSeeder(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @Override
    public void run(String... args) {
        if (problemRepository.count() > 0) {
            log.info("Problem catalog already seeded. Total problems: {}", problemRepository.count());
            return;
        }

        log.info("Seeding initial curated problem catalog...");
        List<Problem> catalog = new ArrayList<>();

        // Arrays
        catalog.add(new Problem(1, "Two Sum", "Easy", "Arrays", "https://leetcode.com/problems/two-sum/", "Find two numbers in array that add to a target."));
        catalog.add(new Problem(26, "Remove Duplicates from Sorted Array", "Easy", "Arrays", "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", "Remove in-place duplicate values from a sorted array."));
        catalog.add(new Problem(53, "Maximum Subarray", "Medium", "Arrays", "https://leetcode.com/problems/maximum-subarray/", "Find the subarray with the largest sum using Kadane's algorithm."));
        catalog.add(new Problem(121, "Best Time to Buy and Sell Stock", "Easy", "Arrays", "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", "Find max profit achievable from a single buy and sell transaction."));
        catalog.add(new Problem(238, "Product of Array Except Self", "Medium", "Arrays", "https://leetcode.com/problems/product-of-array-except-self/", "Compute prefix and suffix product array without using division."));
        catalog.add(new Problem(41, "First Missing Positive", "Hard", "Arrays", "https://leetcode.com/problems/first-missing-positive/", "Find smallest missing positive integer in O(n) time and O(1) space."));

        // Strings
        catalog.add(new Problem(242, "Valid Anagram", "Easy", "Strings", "https://leetcode.com/problems/valid-anagram/", "Determine if string t is an anagram of s."));
        catalog.add(new Problem(125, "Valid Palindrome", "Easy", "Strings", "https://leetcode.com/problems/valid-palindrome/", "Verify if alphanumeric characters form palindrome ignoring cases."));
        catalog.add(new Problem(5, "Longest Palindromic Substring", "Medium", "Strings", "https://leetcode.com/problems/longest-palindromic-substring/", "Find longest palindrome substring by expanding around centers."));
        catalog.add(new Problem(49, "Group Anagrams", "Medium", "Strings", "https://leetcode.com/problems/group-anagrams/", "Group anagrams together using character counts or sorted keys."));
        catalog.add(new Problem(76, "Minimum Window Substring", "Hard", "Strings", "https://leetcode.com/problems/minimum-window-substring/", "Find smallest substring containing all characters of pattern string."));

        // Hash Tables
        catalog.add(new Problem(217, "Contains Duplicate", "Easy", "Hash Tables", "https://leetcode.com/problems/contains-duplicate/", "Check if any value appears at least twice using a Set."));
        catalog.add(new Problem(383, "Ransom Note", "Easy", "Hash Tables", "https://leetcode.com/problems/ransom-note/", "Check if magazine letters can construct note string."));
        catalog.add(new Problem(128, "Longest Consecutive Sequence", "Medium", "Hash Tables", "https://leetcode.com/problems/longest-consecutive-sequence/", "Find length of longest consecutive elements sequence in O(n)."));

        // Linked Lists
        catalog.add(new Problem(206, "Reverse Linked List", "Easy", "Linked Lists", "https://leetcode.com/problems/reverse-linked-list/", "Reverse singly linked list iteratively and recursively."));
        catalog.add(new Problem(21, "Merge Two Sorted Lists", "Easy", "Linked Lists", "https://leetcode.com/problems/merge-two-sorted-lists/", "Splice nodes of two sorted lists together."));
        catalog.add(new Problem(141, "Linked List Cycle", "Easy", "Linked Lists", "https://leetcode.com/problems/linked-list-cycle/", "Detect cycle using Floyd's Tortoise and Hare pointers."));
        catalog.add(new Problem(19, "Remove Nth Node From End of List", "Medium", "Linked Lists", "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", "Remove nth node from end in a single pass using two pointers."));
        catalog.add(new Problem(23, "Merge k Sorted Lists", "Hard", "Linked Lists", "https://leetcode.com/problems/merge-k-sorted-lists/", "Merge k sorted linked lists using a min-heap priority queue."));

        // Two Pointers
        catalog.add(new Problem(11, "Container With Most Water", "Medium", "Two Pointers", "https://leetcode.com/problems/container-with-most-water/", "Maximize water container capacity between two vertical lines."));
        catalog.add(new Problem(15, "3Sum", "Medium", "Two Pointers", "https://leetcode.com/problems/3sum/", "Find all unique triplets that sum up to zero."));
        catalog.add(new Problem(42, "Trapping Rain Water", "Hard", "Two Pointers", "https://leetcode.com/problems/trapping-rain-water/", "Calculate elevation map trapped rain water."));

        // Sliding Window
        catalog.add(new Problem(3, "Longest Substring Without Repeating Characters", "Medium", "Sliding Window", "https://leetcode.com/problems/longest-substring-without-repeating-characters/", "Find length of longest substring without repeating characters."));
        catalog.add(new Problem(424, "Longest Repeating Character Replacement", "Medium", "Sliding Window", "https://leetcode.com/problems/longest-repeating-character-replacement/", "Find length of longest substring with same letter after k replacements."));

        // Binary Search
        catalog.add(new Problem(704, "Binary Search", "Easy", "Binary Search", "https://leetcode.com/problems/binary-search/", "Search target in sorted array in O(log n) time."));
        catalog.add(new Problem(33, "Search in Rotated Sorted Array", "Medium", "Binary Search", "https://leetcode.com/problems/search-in-rotated-sorted-array/", "Find target in rotated sorted array in logarithmic time."));
        catalog.add(new Problem(153, "Find Minimum in Rotated Sorted Array", "Medium", "Binary Search", "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", "Locate inflection point of sorted rotated array."));
        catalog.add(new Problem(4, "Median of Two Sorted Arrays", "Hard", "Binary Search", "https://leetcode.com/problems/median-of-two-sorted-arrays/", "Partition two sorted arrays to find combined median in O(log(min(m,n)))."));

        // Stack & Queue
        catalog.add(new Problem(20, "Valid Parentheses", "Easy", "Stack", "https://leetcode.com/problems/valid-parentheses/", "Validate bracket matching order using a stack."));
        catalog.add(new Problem(155, "Min Stack", "Medium", "Stack", "https://leetcode.com/problems/min-stack/", "Design stack supporting push, pop, top, and retrieving min element in O(1)."));
        catalog.add(new Problem(84, "Largest Rectangle in Histogram", "Hard", "Stack", "https://leetcode.com/problems/largest-rectangle-in-histogram/", "Monotonic stack for largest rectangular area in histogram."));
        catalog.add(new Problem(225, "Implement Stack using Queues", "Easy", "Queue", "https://leetcode.com/problems/implement-stack-using-queues/", "Implement LIFO stack using FIFO queues."));
        catalog.add(new Problem(232, "Implement Queue using Stacks", "Easy", "Queue", "https://leetcode.com/problems/implement-queue-using-stacks/", "Implement FIFO queue using two LIFO stacks."));

        // Trees
        catalog.add(new Problem(104, "Maximum Depth of Binary Tree", "Easy", "Trees", "https://leetcode.com/problems/maximum-depth-of-binary-tree/", "Compute maximum depth from root to leaf node."));
        catalog.add(new Problem(226, "Invert Binary Tree", "Easy", "Trees", "https://leetcode.com/problems/invert-binary-tree/", "Invert binary tree by swapping left and right child nodes."));
        catalog.add(new Problem(102, "Binary Tree Level Order Traversal", "Medium", "Trees", "https://leetcode.com/problems/binary-tree-level-order-traversal/", "Breadth-first search level by level traversal using queue."));
        catalog.add(new Problem(124, "Binary Tree Maximum Path Sum", "Hard", "Trees", "https://leetcode.com/problems/binary-tree-maximum-path-sum/", "Find maximum path sum of any non-empty path in binary tree."));

        // Graphs
        catalog.add(new Problem(200, "Number of Islands", "Medium", "Graphs", "https://leetcode.com/problems/number-of-islands/", "Count connected components in 2D grid using BFS or DFS."));
        catalog.add(new Problem(133, "Clone Graph", "Medium", "Graphs", "https://leetcode.com/problems/clone-graph/", "Deep copy connected undirected graph using hash map tracking visited nodes."));
        catalog.add(new Problem(207, "Course Schedule", "Medium", "Graphs", "https://leetcode.com/problems/course-schedule/", "Detect cycles in directed graph using topological sort or Kahn's algorithm."));

        // Heaps
        catalog.add(new Problem(215, "Kth Largest Element in an Array", "Medium", "Heaps", "https://leetcode.com/problems/kth-largest-element-in-an-array/", "Find kth largest element using min-heap or QuickSelect."));
        catalog.add(new Problem(295, "Find Median from Data Stream", "Hard", "Heaps", "https://leetcode.com/problems/find-median-from-data-stream/", "Maintain two balancing heaps (max-heap and min-heap)."));

        // Greedy & Backtracking
        catalog.add(new Problem(55, "Jump Game", "Medium", "Greedy", "https://leetcode.com/problems/jump-game/", "Determine if you can reach the last index by tracking max reachable index."));
        catalog.add(new Problem(45, "Jump Game II", "Medium", "Greedy", "https://leetcode.com/problems/jump-game-ii/", "Find minimum jumps to reach the end of array."));
        catalog.add(new Problem(78, "Subsets", "Medium", "Backtracking", "https://leetcode.com/problems/subsets/", "Generate all possible power set combinations."));
        catalog.add(new Problem(39, "Combination Sum", "Medium", "Backtracking", "https://leetcode.com/problems/combination-sum/", "Find distinct combinations where candidates sum to target."));
        catalog.add(new Problem(51, "N-Queens", "Hard", "Backtracking", "https://leetcode.com/problems/n-queens/", "Place n queens on an n x n chessboard without mutual attacks."));

        // Dynamic Programming
        catalog.add(new Problem(70, "Climbing Stairs", "Easy", "Dynamic Programming", "https://leetcode.com/problems/climbing-stairs/", "Count distinct ways to climb n steps taking 1 or 2 steps."));
        catalog.add(new Problem(198, "House Robber", "Medium", "Dynamic Programming", "https://leetcode.com/problems/house-robber/", "Determine max money you can rob without alerting police to adjacent houses."));
        catalog.add(new Problem(322, "Coin Change", "Medium", "Dynamic Programming", "https://leetcode.com/problems/coin-change/", "Compute fewest coins needed to make up a given amount."));
        catalog.add(new Problem(300, "Longest Increasing Subsequence", "Medium", "Dynamic Programming", "https://leetcode.com/problems/longest-increasing-subsequence/", "Find length of longest strictly increasing subsequence."));
        catalog.add(new Problem(72, "Edit Distance", "Hard", "Dynamic Programming", "https://leetcode.com/problems/edit-distance/", "Minimum operations (insert, delete, replace) to convert word1 to word2."));

        // Sorting, Recursion, Tries
        catalog.add(new Problem(75, "Sort Colors", "Medium", "Sorting", "https://leetcode.com/problems/sort-colors/", "Dutch National Flag three-way partitioning in a single pass."));
        catalog.add(new Problem(50, "Pow(x, n)", "Medium", "Recursion", "https://leetcode.com/problems/powx-n/", "Calculate x raised to power n using divide and conquer binary exponentiation."));
        catalog.add(new Problem(208, "Implement Trie (Prefix Tree)", "Medium", "Tries", "https://leetcode.com/problems/implement-trie-prefix-tree/", "Implement insert, search, and startsWith prefix tree operations."));

        problemRepository.saveAll(catalog);
        log.info("Successfully seeded {} curated problems across 18 DSA categories.", catalog.size());
    }
}
