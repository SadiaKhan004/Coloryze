
# from fastapi import APIRouter, Request, HTTPException
# import asyncio
# import json
# from app.ai.color_query_builder import build_color_queries
# from app.ai.color_agents import WebSearchAgent
# from app.ai.web_scrapper_agent import WebScraperAgent
# from app.ai.report_generator_agent import FinalAnswerTool

# router = APIRouter()

# # Initialize agents
# search_agent = WebSearchAgent(max_results=2)
# scraper_agent = WebScraperAgent(max_output_chars=8000, concurrency_limit=8)
# final_tool = FinalAnswerTool()

# @router.post("/generate-report/")
# async def generate_final_report(request: Request):
#     """
#     Run the complete pipeline:
#     1. Build color queries
#     2. Perform web search
#     3. Scrape pages (with retry, fallback, and JS-rendered text extraction)
#     4. Combine all text
#     5. Generate final structured report
#     """
#     try:
#         data = await request.json()
#         ai_result = data.get("ai_result", {})

#         if not ai_result:
#             raise HTTPException(status_code=400, detail="Missing AI result data.")

#         print("\n🧠 Received ai_result:")
#         print(ai_result)

#         # Step 1: Build color-related queries
#         queries = build_color_queries(ai_result)
#         if not queries:
#             raise HTTPException(status_code=400, detail="No valid color queries built.")

#         print(f"\n🔍 Built {len(queries)} color queries.\n")

#         all_texts = []

#         # Step 2: Search + scrape for each query
#         for i, q in enumerate(queries):
#             print(f"\n=== Processing Query {i+1}/{len(queries)} ===")
#             print(f"Query: {q}")

#             await asyncio.sleep(0.5)  # avoid search rate limits

#             urls = search_agent.search(q)
#             if not urls:
#                 print(f"⚠️ No URLs found for query: {q}")
#                 continue

#             print(f"✅ Found {len(urls)} URLs, starting scrape...")

#             # Step 3: Scrape each URL (with retries and fallback)
#             scraped_data = await scraper_agent.scrape_multiple(urls)

#             if not scraped_data:
#                 print(f"❌ No text scraped for query: {q}")
#                 continue

#             # Combine and trim
#             combined_text = " ".join(scraped_data.values()).strip()
#             all_texts.append(combined_text)

#             print(f"🧾 Scraped {len(scraped_data)} pages for query '{q}'\n")

#         # Step 4: Merge all scraped text
#         if not all_texts:
#             raise HTTPException(status_code=404, detail="No text scraped from any query.")

#         combined_corpus = " ".join(all_texts)

#         print(f"\n📚 Combined text length: {len(combined_corpus)} characters")
#         print("Generating final report...")

#         # Step 5: Generate AI report - FIXED: Handle string response properly
#         final_output_str = final_tool.forward(combined_corpus, ai_result=ai_result)
        
#         # Parse the string response back to dict
#         try:
#             final_output = json.loads(final_output_str)
#         except json.JSONDecodeError:
#             print("❌ Failed to parse final output as JSON, using fallback")
#             final_output = {
#                 "status": "error",
#                 "recommended_palette": {"main_colors": [], "neutrals": [], "metallics": []},
#                 "final_report": "Error generating report. Please try again."
#             }

#         # Extract data safely
#         final_report = final_output.get("final_report", "No report generated.")
#         recommended_palette = final_output.get("recommended_palette", {})

#         print("\n===============================")
#         print(" FINAL COLORYZE REPORT PREVIEW")
#         print("===============================")
#         print(final_report[:800] if isinstance(final_report, str) else str(final_report)[:800])
#         print("===============================\n")

#         # ✅ Return structured JSON response
#         return {
#             "status": "success",
#             "recommended_palette": recommended_palette,
#             "final_report": final_report
#         }

#     except Exception as e:
#         print(f"🚨 Error in generate_final_report: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# from fastapi import APIRouter, Request, HTTPException
# import json
# import asyncio

# from app.ai.color_query_builder import build_color_queries
# from app.ai.tools.parallel_search_tool import ParallelSearchTool
# from app.ai.report_generator_agent import FinalAnswerTool

# router = APIRouter()

# # Initialize core tools
# parallel_tool = ParallelSearchTool(max_results=5, scrape_timeout=15)
# final_tool = FinalAnswerTool()


# @router.post("/generate-report/")
# async def generate_final_report(request: Request):
#     """
#     Full Coloryze pipeline:
#     1. Build color-related queries
#     2. Perform parallel web search + scraping via ParallelSearchTool
#     3. Combine all text
#     4. Generate final personalized report with FinalAnswerTool
#     """
#     try:
#         data = await request.json()
#         ai_result = data.get("ai_result", {})

#         if not ai_result:
#             raise HTTPException(status_code=400, detail="Missing AI result data.")

#         print("\n🧠 Received ai_result:")
#         print(ai_result)

#         # Step 1: Build color queries
#         queries = build_color_queries(ai_result)
#         if not queries:
#             raise HTTPException(status_code=400, detail="No valid color queries built.")

#         print(f"\n🔍 Built {len(queries)} color queries.\n")

#         all_texts = []

#         # Step 2: For each query → use ParallelSearchTool
#         for i, q in enumerate(queries):
#             print(f"\n=== Processing Query {i+1}/{len(queries)} ===")
#             print(f"Query: {q}")

#             await asyncio.sleep(0.5)  # avoid DDG rate limits

#             try:
#                 result = parallel_tool.forward(q)
#             except Exception as e:
#                 print(f"❌ Parallel search failed for query '{q}': {e}")
#                 continue

#             urls = result.get("urls", [])
#             scraped_data = result.get("scraped_texts", {})
#             combined_text = result.get("combined", "")

#             if not scraped_data:
#                 print(f"⚠️ No text scraped for query: {q}")
#                 continue

#             print(f"✅ Scraped {len(scraped_data)} pages for query '{q}'")
#             all_texts.append(combined_text)

#         # Step 3: Combine all scraped content
#         if not all_texts:
#             raise HTTPException(status_code=404, detail="No text scraped from any query.")

#         combined_corpus = " ".join(all_texts)
#         print(f"\n📚 Combined text length: {len(combined_corpus)} characters")
#         print("🧠 Generating final report...")

#         # Step 4: Generate final report
#         final_output_str = final_tool.forward(scraped_text=combined_corpus, ai_result=ai_result)

#         try:
#             final_output = json.loads(final_output_str)
#         except json.JSONDecodeError:
#             print("❌ Failed to parse final output as JSON, using fallback")
#             final_output = {
#                 "status": "error",
#                 "recommended_palette": {"main_colors": [], "neutrals": [], "metallics": []},
#                 "final_report": "Error generating report. Please try again."
#             }

#         # Step 5: Return structured output
#         final_report = final_output.get("final_report", "No report generated.")
#         recommended_palette = final_output.get("recommended_palette", {})

#         print("\n===============================")
#         print(" FINAL COLORYZE REPORT PREVIEW")
#         print("===============================")
#         print(final_report[:800] if isinstance(final_report, str) else str(final_report)[:800])
#         print("===============================\n")

#         return {
#             "status": "success",
#             "recommended_palette": recommended_palette,
#             "final_report": final_report
#         }

#     except Exception as e:
#         print(f"🚨 Error in generate_final_report: {e}")
#         import traceback
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
from fastapi import APIRouter, Request, HTTPException
import json
import asyncio

from app.ai.color_query_builder import build_color_queries
from app.ai.tools.parallel_search_tool import ParallelSearchTool
from app.ai.report_generator_agent import FinalAnswerTool

router = APIRouter()

# Initialize core tools - INCREASE TIMEOUT for batch processing
parallel_tool = ParallelSearchTool(max_results_per_query=2, scrape_timeout=40)  # Increased timeout
final_tool = FinalAnswerTool()


@router.post("/generate-report/")
async def generate_final_report(request: Request):
    """
    Full Coloryze pipeline:
    1. Build color-related queries
    2. Perform parallel web search + scraping concurrently
    3. Combine all text
    4. Generate final personalized report
    """
    try:
        data = await request.json()
        ai_result = data.get("ai_result", {})

        if not ai_result:
            raise HTTPException(status_code=400, detail="Missing AI result data.")

        print("\n🧠 Received ai_result:")
        print(ai_result)

        # Step 1: Build color queries
        queries = build_color_queries(ai_result)
        if not queries:
            raise HTTPException(status_code=400, detail="No valid color queries built.")

        print(f"\n🔍 Built {len(queries)} color queries.")
        for i, query in enumerate(queries, 1):
            print(f"  {i}. {query}")

        # Step 2: Run ALL searches in ONE concurrent batch 🚀
        print(f"\n🚀 Running ALL {len(queries)} searches in one concurrent batch...")
        
        # Pass ALL queries as a list to the parallel search tool
        search_result_str = await parallel_tool.forward(queries)
        
        try:
            search_result = json.loads(search_result_str)
        except Exception as e:
            print(f"❌ Failed to parse search result: {e}")
            raise HTTPException(status_code=500, detail="Search service error")

        # Check if we got any content
        if not search_result.get("combined_content"):
            print("❌ No content scraped from any query")
            raise HTTPException(status_code=404, detail="No text scraped from any query.")

        # Step 3: Use the combined content from ALL queries
        combined_corpus = search_result["combined_content"]
        successful_queries = search_result.get("successful_queries", [])
        total_sources = search_result.get("total_sources", 0)

        print(f"\n📚 Combined text length: {len(combined_corpus)} characters")
        print(f"✅ {len(successful_queries)}/{len(queries)} queries successful")
        print(f"🌐 {total_sources} total sources scraped")
        print("🧩 Generating final personalized report...\n")

        # Step 4: Generate final report
        final_output_str = final_tool.forward(scraped_text=combined_corpus, ai_result=ai_result)

        try:
            final_output = json.loads(final_output_str)
        except json.JSONDecodeError:
            print("❌ Failed to parse final output as JSON, using fallback")
            final_output = {
                "status": "error",
                "recommended_palette": {"main_colors": [], "neutrals": [], "metallics": []},
                "final_report": "Error generating report. Please try again."
            }

        # Step 5: Return final structured response
        final_report = final_output.get("final_report", "No report generated.")
        recommended_palette = final_output.get("recommended_palette", {})

        print("\n===============================")
        print(" FINAL COLORYZE REPORT PREVIEW")
        print("===============================")
        print(final_report[:800] if isinstance(final_report, str) else str(final_report)[:800])
        print("===============================\n")

        return {
            "status": "success",
            "recommended_palette": recommended_palette,
            "final_report": final_report,
            "successful_queries": len(successful_queries),
            "total_queries": len(queries),
            "total_sources": total_sources,
        }

    except Exception as e:
        print(f"🚨 Error in generate_final_report: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")